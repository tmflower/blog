import { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';

export function Post({ isAuth, setIsAuth, isAdmin }) {
	// set variables for values where state is needed
	const [date, setDate] = useState();
	const [imageUrl, setImageUrl] = useState('');
	const [isApproved, setIsApproved] = useState(false);
	const [message, setMessage] = useState('');

	// set variable for function to redirect user
	const navigate = useNavigate();

	// set variable to reference the collection of all posts in Firestore
	const postsCollectionRef = collection(db, "blogPosts");
	const pendingCollectionRef = collection(db, "pendingPosts");

	// set form values to blank
	const initialState = {
		title: '',
		body: '',
	}

	const [formData, setFormData] = useState(initialState);

	const {title, body} = formData;

	// redirect user to login page if not logged in
	useEffect(() => { console.log("running useEffect checkAuth")
		async function checkAuth() {
			setIsAuth(localStorage.getItem('isAuth'));
			if (!isAuth) window.location.pathname = "/login";
			if (isAdmin) setIsApproved(true);
		}
		checkAuth();
	}, []);

	// save the current date to be added to the post object
	useEffect(() => { console.log("running useEffect getDate")
		async function getDate() {
			let currentDate = new Date();
			setDate(currentDate.toString());
		}
		getDate();
	}, []);


	// general function for handling changes to form input
	const handleChange = (evt) => {
		const {name, value} = evt.target;
		setFormData(formData => ({...formData, [name]: value}));
	}

	// special handler for image file input
	// creates a reference to the image and places it in images folder in Cloud Storage
	// gets the public url for the image and saves it to add to the post object
	const handlePhoto = async(evt) => {
		let file = evt.target.files[0];
		const photoRef = ref(storage, `images/${file.name + v4()}`);
		await uploadBytes(photoRef, file).then((snapshot) => {
			getDownloadURL(snapshot.ref).then((url) => {
				setImageUrl(url);
			});
		});
	}

	// if user is admin, adds the post and its content to Firestore; sets post as approved to render
	// if user is not admin, adds post and its content to Firestore; sets post as not approved to render
	// admin will review and change status to approved if content is appropriate; content will render at that time
	// non-admin user gets an informational message
	async function addPost(evt) {
		evt.preventDefault();
		const newPost = {
			title,
			body,
			imageUrl,
			date,
			author: auth.currentUser.displayName,
			authorId: auth.currentUser.uid,
			isApproved
		}
		await addDoc(postsCollectionRef, newPost);
		if  (isApproved) {
			setFormData(initialState);
			navigate('/');
		}
		else {
			setMessage(`Thanks! Admin will review your post. If approved you'll see it here soon!`);
			await addDoc(pendingCollectionRef, newPost);
		}
	}

	return (
		<div className="post">
			{message.length ? <p className="message">{message}</p>:
			<div>
				<h1>Write a new post</h1>
				<form className="postContainer" onSubmit={addPost}>
					<div className="titleContainer">
						<label htmlFor="title">Title</label>
						<input
						type="text"
						name="title"
						id="title"
						value={title}
						onChange={handleChange}>
						</input>
					</div>
					<div className= "bodyContainer">
						<label htmlFor="body">Body</label>
						<textarea
						name="body"
						id="body"
						value={body}
						onChange={handleChange}>
						</textarea>
					</div>
					<div className="imageContainer">
						<label htmlFor="image">Image</label>
						<input
						type="file"
						encType="multipart/form-data"
						id="image"
						onChange={handlePhoto}>
						</input>
					</div>
					<div className="btnContainer">
						<button type="submit" className="submitBtn">Submit</button>
					</div>
				</form>
			</div>
			}
		</div>
	)
}

import { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';

export function Post({ isAuth, setIsAuth }) {
	const [date, setDate] = useState();
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		async function checkAuth() {
			setIsAuth(localStorage.getItem('isAuth'));
			if (!isAuth) window.location.pathname = "/login";
		}
		checkAuth();
	}, []);

	useEffect(() => {
		async function getDate() {
			let currentDate = new Date();
			// let day = currentDate.getDate();
			// let month = currentDate.getMonth() + 1;
			// let year = currentDate.getFullYear();
			// setDate(`${month}/${day}/${year}`);
			setDate(currentDate.toString());
		}
		getDate();
	}, []);

	const navigate = useNavigate();
	const postsCollectionRef = collection(db, "blogPosts");

	const initialState = {
		title: '',
		body: '',
	}

	const [formData, setFormData] = useState(initialState);

	const {title, body} = formData;

	const handleChange = (evt) => {
		const {name, value} = evt.target;
		setFormData(formData => ({...formData, [name]: value}));
	}

	const handlePhoto = async(evt) => {
		let file = evt.target.files[0];
		const photoRef = ref(storage, `images/${file.name + v4()}`);
		await uploadBytes(photoRef, file).then((snapshot) => {
			getDownloadURL(snapshot.ref).then((url) => {
				setImageUrl(url);
			});
		});
	}

	async function addPost(evt) {
		evt.preventDefault();
		const newPost = {
			title,
			body,
			imageUrl,
			date,
			author: auth.currentUser.displayName,
			authorId: auth.currentUser.uid
		}
		console.log("new post:", newPost)
		await addDoc(postsCollectionRef, newPost);
		setFormData(initialState);
		navigate('/');
	}

	return (
		<div className="post">
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
	)
}

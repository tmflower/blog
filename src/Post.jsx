import { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase-config';
import { getStorage, ref, uploadBytes } from "firebase/storage";

export function Post({ isAuth, setIsAuth }) {
	const [date, setDate] = useState();
	const [photo, setPhoto] = useState();

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
			let day = currentDate.getDate();
			let month = currentDate.getMonth() + 1;
			let year = currentDate.getFullYear();
			// setDate(`${month}/${day}/${year}`);
			setDate(currentDate.toString());
		}
		getDate();
	}, []);

	const navigate = useNavigate();
	const postsCollectionRef = collection(db, "blogPosts");

	// async function handleImage() {
	// 	const storage = getStorage();
	// 	// Create a reference to 'mountains.jpg'
	// 	const photoRef = ref(storage, 'photo.jpg');

	// 	// Create a reference to 'images/mountains.jpg'
	// 	const photoImagesRef = ref(storage, 'images/photo.jpg');

	// 	// While the file names are the same, the references point to different files
	// 	photoRef.name === photoImagesRef.name;           // true
	// 	photoRef.fullPath === photoImagesRef.fullPath;   // false

	// 	const storageRef = ref(storage, 'some-child');

	// 	// 'file' comes from the Blob or File API
	// 	uploadBytes(storageRef, file).then((snapshot) => {
	// 	console.log('Uploaded a blob or file!');
	// 	});
	// }


	const initialState = {
		title: '',
		body: '',
		image: '',
	}

	const [formData, setFormData] = useState(initialState);

	const {title, body, image} = formData;

	const handleChange = (evt) => {
		const {name, value} = evt.target;
		setFormData(formData => ({...formData, [name]: value}));
	}

	async function addPost(evt) {
		evt.preventDefault();
		const newPost = {
			title,
			body,
			image,
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
					<input type="text" name="title" id="title" value={title} onChange={handleChange}></input>
				</div>
				<div className= "bodyContainer">
					<label htmlFor="body">Body</label>
					<textarea name="body" id="body" value={body} onChange={handleChange}></textarea>
				</div>
				<div className="imageContainer">
					<label htmlFor="image">Image</label>
					<input type="file" enctype="multipart/form-data" name="image" id="image" value={image} onChange={handleChange}></input>
				</div>
				<div className="btnContainer">
					<button type="submit" className="submitBtn">Submit</button>
				</div>
			</form>
		</div>
	)
}

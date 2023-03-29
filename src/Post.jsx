import { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase-config';

export function Post({ isAuth, setIsAuth }) {
	useEffect(() => {
		async function checkAuth() {
			setIsAuth(localStorage.getItem('isAuth'));
			console.log("auth", isAuth)
			if (!isAuth) window.location.pathname = "/login";
		}
		checkAuth();
	}, []);

	const navigate = useNavigate();
	const postsCollectionRef = collection(db, "blogPosts");

	const initialState = {
		title: '',
		body: '',
		image: '',
		date: ''
	}

	const [formData, setFormData] = useState(initialState);

	const {title, body, image, date} = formData;

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
				<div className="dateContainer">
					<label htmlFor="date">Date</label>
					<input type="text" name="date" id="date" value={date} onChange={handleChange}></input>
				</div>
				<div className= "bodyContainer">
					<label htmlFor="body">Body</label>
					<textarea name="body" id="body" value={body} onChange={handleChange}></textarea>
				</div>
				<div className="imageContainer">
					<label htmlFor="image">Image</label>
					<input type="text" name="image" id="image" value={image} onChange={handleChange}></input>
				</div>
				<div className="btnContainer">
					<button type="submit" className="submitBtn">Submit</button>
				</div>
			</form>
		</div>
	)
}

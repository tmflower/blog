import { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import sadie1 from './assets/sadie1.jpg';
import sadie2 from './assets/sadie2.jpg';

export function Home( { isAdmin }) {
	// set variables for accessing and rendering content of posts
	const [allPosts, setAllPosts] = useState([]);
	const postsCollectionRef = collection(db, "blogPosts");

	// if user confirms yes, remove the selected post from Firestore
	const deletePost = async (id) => {
		if (window.confirm("Are you sure you want to permanently delete this post?")) {
			const selectedDoc = doc(db, "blogPosts", id)
			await deleteDoc(selectedDoc);
		}
	}

	// when the page loads and when a post is deleted, get all the posts and their content with the most recent post first
	// add an id to each document; this will be used when deleting a post
	useEffect(() => {
		async function getPosts() {
			const myDocs = await getDocs(query(postsCollectionRef, orderBy('date', 'desc')));
			const data = myDocs.docs.map((doc) => ({...doc.data(), id: doc.id }));
			// TODO: add filter to only show posts with status of 'isApproved' (currently in Post)
			setAllPosts(data);
		}
		getPosts();
	}, [deletePost]);

	return (
		<div className="home">
			<div className="headerContainer">
				<img src={sadie1} alt="fluffy calico cat lying on floor among parts of a disassembled computer" className="mainImage"/>
				<h1>SadieCat Learns to Code</h1>

			</div>
			<p className="intro">When I started learning how to code, my cat Sadie took a keen interest in learning with me. My goal in writing this blog is to document some of the things I'm learning and communicate them in a way that even Sadie can understand.</p>

			<img src={sadie2} alt="fluffy calico cat lying on desk with head resting on mousepad and paws on keyboard" className="mainImage"/>

			{allPosts.map((post, i) => {
				return <div key={i} className="singlePostContainer">
							<div className="titleAndButtonContainer">
								<p className="singlePostTitle">{post.title}</p>
								{post.authorId === auth.currentUser.uid || isAdmin ?
								<button className="deleteBtn" onClick={() => deletePost(post.id)}>&#x1f6ae;</button>:
								null}
							</div>
							<img src={post.imageUrl} alt="" className="singlePostImage"/>
							<p className="singlePostBody">{post.body}</p>
							<p className="author-date">posted by {post.author} on {post.date}</p>
						</div>
			})}
		</div>
	)
}

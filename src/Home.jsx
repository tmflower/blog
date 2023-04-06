import { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy, doc, deleteDoc, where } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
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
	// return only posts with status of 'isApproved'
	useEffect(() => {
		async function getPosts() {
			const myDocs = await getDocs(query(postsCollectionRef, where("isApproved", "==", true), orderBy('date', 'desc')));
			const data = myDocs.docs.map((doc) => ({...doc.data(), id: doc.id }));
			setAllPosts(data);
		}
		getPosts();
	}, [deletePost]);

	return (
		<div className="home">
			<div className="headerContainer">
				<h1>SadieCat Learns to Code</h1>
				<div className="headerImages">
					<img src={sadie1} alt="fluffy calico cat lying on floor among parts of a disassembled computer" className="mainImage"/>
					<img src={sadie2} alt="fluffy calico cat lying on desk with head resting on mousepad and paws on keyboard" className="mainImage"/>
				</div>
			</div>
			<p className="intro">When I started learning how to code, my cat Sadie took a keen interest in learning with me. It is often said that the best way to learn something is by teaching it. No one said you have to teach to a member of the same species. So here goes: I'm going to teach Sadie the things I learn as I continue to develop my coding skills.</p>
			<p className='intro'>If you have a Google account, you can log in and add your own post here, too! Just click on the Login link at the top.</p>

			{!allPosts.length? <p className='message'>Hmmm, looks like there aren't any posts yet. Or more likely I've exceeded my Firebase storage quota again. &#x1f644; In any event, check back soon!</p> :
			<div>
				{allPosts.map((post, i) => {
					return <div key={i} className="singlePostContainer">
								<div className="titleAndButtonContainer">
									<p className="singlePostTitle">{post.title}</p>
									{auth.currentUser && post.authorId === auth.currentUser.uid || isAdmin ?
									<button className="deleteBtn" onClick={() => deletePost(post.id)}>&#x1f6ae;</button>:
									null}
								</div>
								<img src={post.imageUrl} alt="" className="singlePostImage"/>
								<p className="singlePostBody">{post.body}</p>
								<p className="author-date">posted by {post.author} on {post.date}</p>
							</div>
				})}
			</div>
			}
		</div>
	)
}

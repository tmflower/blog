import { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import sadie1 from './assets/sadie1.jpg';
import sadie2 from './assets/sadie2.jpg';

export function Home() {
	const [allPosts, setAllPosts] = useState([]);
	const postsCollectionRef = collection(db, "blogPosts");

	useEffect(() => {
		async function getPosts() {
			const myDocs = await getDocs(query(postsCollectionRef, orderBy('date', 'desc')));
			const data = myDocs.docs.map((doc) => ({...doc.data(), id: doc.id }));
			setAllPosts(data);
		}
		getPosts();
	}, []);

	return (
		<div className="home">
			<div className="headerContainer">
				<img src={sadie1} alt="fluffy calico cat lying on floor among parts of a disassembled computer" className="mainImage"/>
				<h1>SadieCat Learns to Code</h1>

			</div>
			<p className="intro">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>

			<img src={sadie2} alt="fluffy calico cat lying on desk with head resting on mousepad and paws on keyboard" className="mainImage"/>

			{allPosts.map((post, i) => {
				return <div key={i} className="singlePostContainer">
							<p className="singlePostTitle">{post.title}</p>
							{/* <img src={post.image} alt="" className="singlePostImage"/> */}
							<p className="singlePostBody">{post.body}</p>
							<p className="author-date">posted by {post.author} on {post.date}</p>
						</div>
			})}
		</div>
	)
}

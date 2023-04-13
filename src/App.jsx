import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from "firebase/auth";
import './App.css';
import { Home } from './Home.jsx';
import { Login } from './Login';
import { Post } from './Post';
import meow from '../meow.png'

// const adminId = "JpPamWIU2tdsg2TRziSSFhLZmGr1";

function App() {
	// set default status of user to not logged in and not admin
	// these states will be updated when user logs in
	const [isAuth, setIsAuth] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	// if there is a logged in user, check if that user is admin
	// set admin status to true so this can be passed to Home and Post for tasks requiring admin status
	// useEffect(() => {
	// 	if (auth.currentUser !== null) { console.log("running useEffect confirmAdmin")
	// 		async function confirmAdmin() {
	// 			if (auth.currentUser.uid == adminId) {
	// 				setIsAdmin(true);
	// 			}
	// 		}
	// 		confirmAdmin();
	// 	}
	// }, []);

	// use Firebase method to sign user out when "Logout" is selected
	// change locally stored user status to logged out
	async function logout() {
		await signOut(auth);
		localStorage.clear();
		setIsAuth(false);
		window.location.pathname = "/login";
		}

	return (
		<BrowserRouter>
				<nav>
					<NavLink to="/" className="navlink"> <img src={meow} alt="clipart of smiling calico cat" className="logo"/></NavLink>
					{isAuth ? <NavLink to="/post" className="navlink"> New Post </NavLink> : null}
					{!isAuth ? <NavLink to="/login" className="navlink"> Login </NavLink> : <button id="logout-btn" onClick={logout}><NavLink className="navlink">Logout</NavLink></button>}
				</nav>
				<Routes>
					<Route path="/" element={<Home isAdmin={isAdmin}/>}></Route>
					<Route path="/login" element={<Login setIsAuth={setIsAuth} setIsAdmin={setIsAdmin}/>}></Route>
					<Route path="/post" element={<Post isAuth={isAuth} setIsAuth={setIsAuth} isAdmin={isAdmin}/>}></Route>
				</Routes>
			</BrowserRouter>
	)
	}

export default App;

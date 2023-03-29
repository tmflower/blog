import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from "firebase/auth";
import './App.css';
import { Home } from './Home.jsx';
import { Login } from './Login';
import { Post } from './Post';

function App() {
  const [isAuth, setIsAuth] = useState(false);

	async function logout() {
		await signOut(auth);
		localStorage.clear();
		setIsAuth(false);
		window.location.pathname = "/login";
	}

  return (
    <BrowserRouter>
			<nav>
				<NavLink to="/" className="navlink"> Home </NavLink>
				{isAuth ? <NavLink to="/post" className="navlink"> Post </NavLink> : null}
				{!isAuth ? <NavLink to="/login" className="navlink"> Login </NavLink> : <button id="logout-btn" onClick={logout}><NavLink className="navlink">Logout</NavLink></button>}
			</nav>
			<Routes>
				<Route path="/" element={<Home/>}></Route>
				<Route path="/login" element={<Login setIsAuth={setIsAuth}/>}></Route>
				<Route path="/post" element={<Post isAuth={isAuth} setIsAuth={setIsAuth}/>}></Route>
			</Routes>
		</BrowserRouter>
  )
}

export default App;

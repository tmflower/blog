import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const adminId = "JpPamWIU2tdsg2TRziSSFhLZmGr1";

export function Login({ setIsAuth, setIsAdmin }) {

	// set variable for function to redirect user
	const navigate = useNavigate();

	// function to handle user login with Firebase authorization Google pop-up tool
	async function loginWithGoogle() {
		await signInWithPopup(auth, provider);
		localStorage.setItem("isAuth", true);
		setIsAuth(true);
		if (auth.currentUser.uid == adminId) {
			setIsAdmin(true);
		}
		navigate('/');
	}

	return (
		<div className="login">
			<h1>Log in to create a new post</h1>
			<button className="login-with-google-btn" onClick={loginWithGoogle}>Sign in with Google</button>
		</div>
	)
}

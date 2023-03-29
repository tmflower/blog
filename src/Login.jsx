import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function Login({ setIsAuth }) {

	const navigate = useNavigate();

	async function loginWithGoogle() {
		await signInWithPopup(auth, provider);
		localStorage.setItem("isAuth", true);
		setIsAuth(true);
		navigate('/');
	}

	return (
		<div className="login">
			<h1>Log in to create a new post</h1>
			<button className="login-with-google-btn" onClick={loginWithGoogle}>Sign in with Google</button>
		</div>
	)
}

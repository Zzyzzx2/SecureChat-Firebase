import React from "react";
import { auth, provider } from "../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="m-5 text-11xl text-sky-600">SecureWhisper</h1>
      <br></br>
      <button
        className="hover:bg-blue-700 hover:border-cyan-600 hover:border-2"
        onClick={signInWithGoogle}
      >
        Sign in With Google
      </button>
    </div>
  );
};

export default Auth;

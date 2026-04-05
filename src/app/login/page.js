"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  {/*Login with Google (optional)*/}
    const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/");
  } catch (err) {
    alert("Google login failed");
  }
};
  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
      }
      router.push("/");
    } catch (err) {
      // 🔥 Better error handling
      if (err.code === "auth/user-not-found") {
        alert("No account found. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (err.code === "auth/email-already-in-use") {
        alert("Account already exists. Please login.");
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
<div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-gray-200">    
<div className="bg-white/90 backdrop-blur p-10 rounded-2xl shadow-lg w-full max-w-md">      
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        {isLogin ? "Login" : "Sign Up"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleAuth}
        className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
      {/* Optional Google Login button */}
        <button
        onClick={handleGoogleLogin}
        className="w-full mt-4 bg-white border border-gray-300 text-gray-700 text-lg font-semibold py-3 rounded-lg hover:bg-gray-100 transition"
        >
        Continue with Google
        </button>
      <p className="text-center mt-6 text-gray-700 text-base">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 font-semibold cursor-pointer ml-1"
        >
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  </div>
);
}
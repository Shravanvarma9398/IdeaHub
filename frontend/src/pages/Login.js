import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const validate = () => {

if(!email || !password){
setError("All fields are required");
return false;
}

const emailRegex = /\S+@\S+\.\S+/;

if(!emailRegex.test(email)){
setError("Enter a valid email address");
return false;
}

return true;

};

const login = async (e) => {

e.preventDefault();

setError("");

if(!validate()) return;

try{

setLoading(true);

const res = await axios.post(
"https://ideahub-c0kt.onrender.com/login",
{email,password}
);

localStorage.setItem("token",res.data.token);
localStorage.setItem("userId",res.data.user._id);
localStorage.setItem("userName",res.data.user.name);

navigate("/home");

}catch(err){

setError("Invalid email or password");

}

setLoading(false);

};

return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
Login
</h2>

<form onSubmit={login}>

{/* Email */}

<div className="flex items-center border rounded p-2 mb-4">

<FaEnvelope className="text-gray-400 mr-2"/>

<input
type="email"
placeholder="Enter your email"
className="w-full outline-none"
value={email}
onChange={(e)=>{
setEmail(e.target.value);
setError("");
}}
/>

</div>

{/* Password */}

<div className="flex items-center border rounded p-2 mb-2">

<FaLock className="text-gray-400 mr-2"/>

<input
type="password"
placeholder="Enter password"
className="w-full outline-none"
value={password}
onChange={(e)=>{
setPassword(e.target.value);
setError("");
}}
/>

</div>

{/* Error message */}

{error && (
<p className="text-red-500 text-sm mb-3 text-center">
{error}
</p>
)}

<button
type="submit"
disabled={loading}
className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
>

{loading ? "Logging in..." : "Login"}

</button>

</form>

<p className="text-center mt-4 text-gray-600">

Don't have an account?

<Link
to="/signup"
className="text-blue-600 font-semibold ml-1"
>
Signup
</Link>

</p>

</div>

</div>

);

}

export default Login;
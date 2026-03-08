import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Signup() {

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [errors,setErrors] = useState({});
const [strength,setStrength] = useState("");

const checkPasswordStrength = (pwd) => {

if(pwd.length < 6){
setStrength("Weak");
}else if(pwd.length < 10){
setStrength("Medium");
}else{
setStrength("Strong");
}

};

const signup = async (e) => {

e.preventDefault();

let newErrors = {};

if(!name) newErrors.name = "Name is required";
if(!email) newErrors.email = "Email is required";
if(!password) newErrors.password = "Password is required";

setErrors(newErrors);

if(Object.keys(newErrors).length > 0) return;

try{

await axios.post(
"https://ideahub-api.onrender.com/signup",
{name,email,password}
);

navigate("/login");

}catch(err){

setErrors({api:"Signup failed. Try again."});

}

};

return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
Create Account
</h2>

<form onSubmit={signup}>

{/* Name */}

<div className="mb-3">

<div className="flex items-center border rounded p-2">

<FaUser className="text-gray-400 mr-2"/>

<input
type="text"
placeholder="Full Name"
className="w-full outline-none"
onChange={(e)=>setName(e.target.value)}
/>

</div>

{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

</div>

{/* Email */}

<div className="mb-3">

<div className="flex items-center border rounded p-2">

<FaEnvelope className="text-gray-400 mr-2"/>

<input
type="email"
placeholder="Email"
className="w-full outline-none"
onChange={(e)=>setEmail(e.target.value)}
/>

</div>

{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

</div>

{/* Password */}

<div className="mb-3">

<div className="flex items-center border rounded p-2">

<FaLock className="text-gray-400 mr-2"/>

<input
type="password"
placeholder="Password"
className="w-full outline-none"
onChange={(e)=>{
setPassword(e.target.value);
checkPasswordStrength(e.target.value);
}}
/>

</div>

{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

</div>

{/* Password Strength */}

{password && (

<p className={`text-sm mb-3 ${
strength === "Weak" ? "text-red-500" :
strength === "Medium" ? "text-yellow-500" :
"text-green-500"
}`}>
Password Strength: {strength}
</p>

)}

{/* API error */}

{errors.api && (
<p className="text-red-500 text-sm mb-3">
{errors.api}
</p>
)}

<button
type="submit"
className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
>
Signup
</button>

</form>

<p className="text-center mt-4 text-gray-600">

Already have an account?

<Link to="/login" className="text-blue-600 ml-1 font-semibold">
Login
</Link>

</p>

</div>

</div>

);

}

export default Signup;
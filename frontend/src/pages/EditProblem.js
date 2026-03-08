import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProblem(){

const { id } = useParams();
const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

useEffect(()=>{

axios.get("http://localhost:5000/problems")
.then(res=>{

const problem = res.data.find(p => p._id === id);

if(problem){
setTitle(problem.title);
setDescription(problem.description);
}

})
.catch(err=>{
console.log(err);
setError("Failed to load idea");
});

},[id]);

const updateProblem = async (e) => {

e.preventDefault();
setError("");

if(!title || !description){
setError("All fields are required");
return;
}

try{

setLoading(true);

const token = localStorage.getItem("token");

await axios.put(
`http://localhost:5000/problems/${id}`,
{
title,
description
},
{
headers:{ authorization:token }
}
);

navigate("/home");

}catch(err){

console.log(err.response?.data || err.message);
setError("Failed to update idea");

}

setLoading(false);

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
Edit Idea
</h2>

<form onSubmit={updateProblem}>

<input
className="border p-2 w-full mb-3 rounded"
placeholder="Idea title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
className="border p-2 w-full mb-3 rounded"
rows="4"
placeholder="Describe your idea"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

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

{loading ? "Updating..." : "Update Idea"}

</button>

</form>

</div>

</div>

)

}

export default EditProblem;
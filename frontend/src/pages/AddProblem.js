import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProblem(){

const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [category,setCategory] = useState("Technology");
const [image,setImage] = useState(null);
const [preview,setPreview] = useState(null);

const handleImage = (file) => {

if(!file) return;

setImage(file);

const reader = new FileReader();

reader.onloadend = () => {
setPreview(reader.result);
};

reader.readAsDataURL(file);

};

const submit = async () => {

try{

const token = localStorage.getItem("token");

if(!token){
alert("Please login first");
navigate("/login");
return;
}

if(!title || !description){
alert("Please fill all fields");
return;
}

const formData = new FormData();

formData.append("title",title);
formData.append("description",description);
formData.append("category",category);

if(image){
formData.append("image",image);
}

await axios.post(
"https://ideahub-c0kt.onrender.com/problems",
formData,
{
headers:{
authorization: token,
"Content-Type": "multipart/form-data"
}
}
);

alert("Idea posted successfully 🚀");

setTitle("");
setDescription("");
setCategory("Technology");
setImage(null);
setPreview(null);

navigate("/home");

}catch(err){

console.log(err.response?.data || err.message);
alert("Error posting problem");

}

};

return(

<div className="flex justify-center items-center min-h-screen bg-gray-100">

<div className="bg-white p-8 shadow-lg rounded-xl w-96">

<h2 className="text-2xl font-bold mb-4">
Post a Startup Idea
</h2>

<input
className="border p-2 w-full mb-3 rounded"
placeholder="Idea title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
className="border p-2 w-full mb-3 rounded"
placeholder="Describe your idea"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<select
className="border p-2 w-full mb-3 rounded"
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option>Technology</option>
<option>Transport</option>
<option>Health</option>
<option>Education</option>
<option>Business</option>

</select>

{/* IMAGE UPLOAD */}

<div
className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer mb-3 hover:border-blue-500 transition"
onClick={()=>document.getElementById("imageInput").click()}
>

<p className="text-gray-500">
Click to Upload Idea Image
</p>

<input
id="imageInput"
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>handleImage(e.target.files[0])}
/>

</div>

{/* IMAGE PREVIEW */}

{preview && (

<div className="mb-3">

<img
src={preview}
alt="preview"
className="w-full h-40 object-cover rounded"
/>

<button
className="text-red-500 text-sm mt-2"
onClick={()=>{
setImage(null);
setPreview(null);
}}
>
Remove Image
</button>

</div>

)}

<button
className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 transition"
onClick={submit}
>
Submit Idea
</button>

</div>

</div>

)

}

export default AddProblem;
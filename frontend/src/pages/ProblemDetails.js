import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProblemDetails(){

const { id } = useParams();

const [problem,setProblem] = useState(null);
const [solutions,setSolutions] = useState([]);
const [text,setText] = useState("");

useEffect(()=>{

axios.get("https://ideahub-c0kt.onrender.com/problems")
.then(res=>{
const found = res.data.find(p=>p._id === id);
setProblem(found);
});

axios.get(`https://ideahub-c0kt.onrender.com/solutions/${id}`)
.then(res=>setSolutions(res.data));

},[id]);

const addSolution = async ()=>{

if(!text.trim()){
alert("Solution cannot be empty");
return;
}

try{

const token = localStorage.getItem("token");

await axios.post(
"https://ideahub-c0kt.onrender.com/solutions",
{
problemId:id,
solutionText:text
},
{
headers:{authorization:token}
}
);

setText("");

const res = await axios.get(`https://ideahub-c0kt.onrender.com/solutions/${id}`);
setSolutions(res.data);

}catch(err){

console.log(err);
alert("Failed to add solution");

}

};

if(!problem) return <div className="p-10">Loading...</div>;

return(

<div className="max-w-4xl mx-auto p-10">

{/* Title */}
<h1 className="text-3xl font-bold mb-6">{problem.title}</h1>

{/* Idea Image */}
{problem.image && (
<img
src={problem.image}
alt="idea"
className="w-full h-72 object-cover rounded-lg mb-6"
/>
)}

{/* Description */}
<div className="bg-white shadow-md rounded-lg p-6">

<p
style={{
whiteSpace:"pre-line",
lineHeight:"1.7",
fontSize:"16px"
}}
>
{problem.description}
</p>

</div>

{/* Community Support */}
<h2 className="text-xl font-semibold mt-10 mb-4">
Community Support
</h2>

{solutions.map(s=>(

<div key={s._id} className="bg-gray-100 p-4 mt-3 rounded-lg">

<p className="text-gray-800">{s.solutionText}</p>

<p className="text-xs text-gray-500 mt-2">
supported by {s.userName}
</p>

</div>

))}

{/* Add Support */}
<textarea
className="border p-3 w-full mt-6 rounded"
placeholder="Share your suggestion or support..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button
className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 mt-3 rounded"
onClick={addSolution}
>
Share Support
</button>

</div>

);

}

export default ProblemDetails;
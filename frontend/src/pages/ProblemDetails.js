import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProblemDetails(){

const { id } = useParams();

const [problem,setProblem] = useState(null);
const [solutions,setSolutions] = useState([]);
const [text,setText] = useState("");

// collaborate alert
const collaborate = () => {
alert("Collaboration feature coming soon 🚀");
};

useEffect(()=>{

axios.get("https://ideahub-api.onrender.com/problems")
.then(res=>{
const found = res.data.find(p=>p._id === id);
setProblem(found);
});

axios.get(`https://ideahub-api.onrender.com/solutions/${id}`)
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
"https://ideahub-api.onrender.com/solutions",
{
problemId:id,
solutionText:text
},
{
headers:{ authorization:token }
}
);

setText("");

const res = await axios.get(`https://ideahub-api.onrender.com/solutions/${id}`);
setSolutions(res.data);

}catch(err){

console.log(err);
alert("Failed to add solution");

}

};

if(!problem) return <div>Loading...</div>;

return(

<div className="p-10">

<h1 className="text-3xl font-bold">
{problem.title}
</h1>

<p className="mt-4 text-grey-700 leading-relaxed whitespace-pre-line">
{problem.description}
</p>

{/* COLLABORATE BUTTON */}

<button
onClick={collaborate}
className="bg-blue-600 text-white px-4 py-2 mt-6 rounded"
>
Collaborate
</button>

<h2 className="text-xl mt-8">
Community Support
</h2>

{solutions.map(s=>(
<div key={s._id} className="bg-gray-100 p-3 mt-3 rounded">

<p>{s.solutionText}</p>

<p className="text-xs text-gray-500 mt-1">
supported by {s.userName}
</p>

</div>
))}

<textarea
className="border p-2 w-full mt-6"
placeholder="Share your idea or support for this startup..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button
className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
onClick={addSolution}
>
Share Support
</button>

</div>

);

}

export default ProblemDetails;
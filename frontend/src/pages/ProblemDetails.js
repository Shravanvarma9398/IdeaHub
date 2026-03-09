import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProblemDetails() {

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

const formatDescription = (text)=>{
if(!text) return null;

const sections = [
"Problem",
"Solution",
"How It Works",
"Target Locations",
"Business Model",
"Impact",
"Collaboration Needed",
"Vision"
];

let formatted = text;

sections.forEach(section=>{
const regex = new RegExp(section,"g");
formatted = formatted.replace(regex,`\n\n${section}\n`);
});

return formatted.split("\n").map((line,index)=>{

if(sections.includes(line.trim())){
return(

<h3 key={index} className="text-xl font-semibold mt-6 text-gray-800">
{line}
</h3>
);
}

return line.trim() !== "" ? (

<p key={index} className="text-gray-600 leading-7 mt-2">
{line}
</p>
) : null;

});
};

if(!problem) return <div className="p-10">Loading...</div>;

return(

<div className="max-w-4xl mx-auto p-10">

<h1 className="text-3xl font-bold text-gray-900 mb-6">
{problem.title}
</h1>

{problem.image && ( <img
src={problem.image}
alt="idea"
className="w-full h-72 object-cover rounded-lg mb-6"
/>
)}

<div>
{formatDescription(problem.description)}
</div>

<h2 className="text-xl font-semibold mt-10 mb-4">
Community Support
</h2>

{solutions.map(s=>(

<div key={s._id} className="bg-gray-100 p-4 mt-3 rounded-lg">

<p className="text-gray-700">
{s.solutionText}
</p>

<p className="text-xs text-gray-500 mt-2">
supported by {s.userName}
</p>

</div>

))}

<textarea
className="border rounded p-3 w-full mt-6"
placeholder="Share your support or improvement..."
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

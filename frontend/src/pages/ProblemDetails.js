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

/* ---------- CLEAN DESCRIPTION FORMATTER ---------- */

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

/* force line breaks before sections */

sections.forEach(section=>{
const regex = new RegExp(section,"gi");
formatted = formatted.replace(regex,`\n\n${section}\n`);
});

/* split into paragraphs */

return formatted.split("\n").map((line,index)=>{

const trimmed = line.trim();

if(trimmed === "") return null;

if(sections.includes(trimmed)){

return(
<h2
key={index}
style={{
fontSize:"22px",
fontWeight:"600",
marginTop:"28px",
marginBottom:"8px",
color:"#1f2937"
}}
>
{trimmed}
</h2>
);

}

return(

<p
key={index}
style={{
lineHeight:"1.8",
fontSize:"16px",
color:"#374151",
marginTop:"6px"
}}
>
{trimmed}
</p>

);

});

};

if(!problem) return <div style={{padding:"40px"}}>Loading...</div>;

return(

<div
style={{
maxWidth:"900px",
margin:"40px auto",
padding:"20px"
}}
>

<h1
style={{
fontSize:"32px",
fontWeight:"700",
marginBottom:"25px",
color:"#111827"
}}
>
{problem.title}
</h1>

{problem.image && (

<img
src={problem.image}
alt="idea"
style={{
width:"100%",
height:"320px",
objectFit:"cover",
borderRadius:"10px",
marginBottom:"25px"
}}
/>

)}

<div>
{formatDescription(problem.description)}
</div>

<h2
style={{
fontSize:"22px",
fontWeight:"600",
marginTop:"40px"
}}
>
Community Support
</h2>

{solutions.map(s=>(

<div
key={s._id}
style={{
background:"#f3f4f6",
padding:"16px",
marginTop:"12px",
borderRadius:"8px"
}}
>

<p style={{color:"#374151"}}>
{s.solutionText}
</p>

<p
style={{
fontSize:"12px",
color:"#6b7280",
marginTop:"6px"
}}
>
supported by {s.userName}
</p>

</div>

))}

<textarea
style={{
border:"1px solid #ddd",
borderRadius:"6px",
padding:"12px",
width:"100%",
marginTop:"25px"
}}
placeholder="Share your support or improvement..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button
style={{
background:"#16a34a",
color:"#fff",
padding:"10px 18px",
marginTop:"12px",
borderRadius:"6px",
border:"none",
cursor:"pointer"
}}
onClick={addSolution}
>
Share Support
</button>

</div>

);

}

export default ProblemDetails;
import { useState, useEffect } from "react";
import axios from "axios";
import ProblemCard from "../components/ProblemCard";

const API = "https://ideahub-api.onrender.com";

function Home(){

const [problems,setProblems] = useState([]);
const [search,setSearch] = useState("");

useEffect(()=>{

axios.get(`${API}/problems`)
.then(res=>setProblems(res.data))
.catch(err=>console.log(err));

},[]);

const handleVote = async (id)=>{

await axios.put(`${API}/vote/${id}`);

setProblems(prev =>
prev.map(p =>
p._id === id
? {...p, votes:p.votes+1}
: p
)
);

};

const deleteProblem = async (id)=>{

try{

const token = localStorage.getItem("token");

await axios.delete(
`${API}/problems/${id}`,
{
headers:{ authorization:token }
}
);

setProblems(prev => prev.filter(p => p._id !== id));

}catch(err){

console.log(err);
alert("Error deleting problem");

}

};

return(

<div className="px-4 sm:px-10 py-6 bg-gray-100 min-h-screen max-w-7xl mx-auto">

{/* SEARCH */}

<input
className="border p-2 mb-6 w-full rounded"
placeholder="Search problems..."
onChange={(e)=>setSearch(e.target.value)}
/>

{/* PROBLEMS GRID */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

{problems
.filter(p=>p.title.toLowerCase().includes(search.toLowerCase()))
.map(p=>(
<ProblemCard
key={p._id}
problem={p}
onVote={handleVote}
onDelete={deleteProblem}
/>
))}

</div>

</div>

)

}

export default Home;
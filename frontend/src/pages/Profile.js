import { useEffect, useState } from "react";
import axios from "axios";

function Profile(){

const [problems,setProblems] = useState([]);
const [solutions,setSolutions] = useState([]);

const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

useEffect(()=>{

axios.get("https://ideahub-c0kt.onrender.com/problems")
.then(res=>{

const userProblems = res.data.filter(p => p.user === userId);
setProblems(userProblems);

});

axios.get("https://ideahub-c0kt.onrender.com/solutions")
.then(res=>{

const userSolutions = res.data.filter(s => s.userId === userId);
setSolutions(userSolutions);

});

},[userId]);

return(

<div className="p-6">

<h2 className="text-xl font-semibold mb-4 text-blue-600">
👤 {userName ? userName : "User"}
</h2>

<div className="bg-white shadow rounded p-4">

<p className="mb-2">
Problems Posted: <b>{problems.length}</b>
</p>

<p>
Solutions Submitted: <b>{solutions.length}</b>
</p>

</div>

</div>

);

}

export default Profile;
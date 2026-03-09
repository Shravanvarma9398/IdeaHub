import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProblemCard({ problem, onVote, onDelete }) {

const currentUserId = localStorage.getItem("userId");
const isOwner = problem.user === currentUserId;

const imageUrl = problem.image
? `https://ideahub-c0kt.onrender.com/uploads/${problem.image}`
: "https://via.placeholder.com/400x250?text=IdeaHub";

const [burst,setBurst] = useState(false);

const handleLike = () => {
onVote(problem._id);
setBurst(true);
setTimeout(()=> setBurst(false), 500);
};

return (

<div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition flex flex-col w-full">

{/* IMAGE */}

<div className="relative w-full bg-gray-100 flex items-center justify-center">

<img
src={imageUrl}
alt="idea"
className="w-full h-64 object-cover"
/>

{/* IDEA OWNER BADGE */}

{isOwner && (
<span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
Your Idea
</span>
)}

</div>

{/* CONTENT */}

<div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">

<div>

<h2 className="text-base sm:text-lg font-semibold mb-1">
{problem.title}
</h2>

<p className="text-xs sm:text-sm text-gray-500">
Posted by {problem.userName || "Anonymous"}
</p>

{/* CATEGORY BADGE */}

<span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
{problem.category}
</span>

</div>

{/* ACTIONS */}

<div className="flex justify-between items-center mt-4">

<Link
to={`/problem/${problem._id}`}
className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
>
See Details
</Link>

<div className="relative flex items-center gap-2">

<button
onClick={handleLike}
className="text-red-500 relative"
>
<FaHeart size={20}/>

{burst && (
<div className="burst-container">
<span className="particle p1"></span>
<span className="particle p2"></span>
<span className="particle p3"></span>
<span className="particle p4"></span>
<span className="particle p5"></span>
<span className="particle p6"></span>
</div>
)}

</button>

<span className="text-gray-700 text-sm">
{problem.votes}
</span>

</div>

</div>

{/* OWNER OPTIONS */}

{isOwner && (
<div className="flex gap-4 mt-3 text-xs sm:text-sm">

<Link
to={`/edit/${problem._id}`}
className="text-blue-500 hover:underline"
>
Edit
</Link>

<button
onClick={()=>onDelete(problem._id)}
className="text-red-500 hover:underline"
>
Delete
</button>

</div>
)}

</div>

</div>

);

}

export default ProblemCard;
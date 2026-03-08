import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

function Navbar(){

const navigate = useNavigate();

const token = localStorage.getItem("token");

const logout = () => {
localStorage.removeItem("token");
navigate("/");
window.location.reload();
};

return(

<nav className="bg-white shadow-md">

<div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">

<h1 className="text-xl sm:text-2xl font-bold text-blue-600">
IdeaHub
</h1>

<div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">

<Link to="/">Explore</Link>

<Link
to="/add"
className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded"
>
<FiPlusCircle/>
Post
</Link>

{!token && (
<>
<Link to="/login">Login</Link>
<Link to="/signup">Signup</Link>
</>
)}

{token && (
<>
<Link to="/profile">
<FaUserCircle size={26}/>
</Link>

<button
className="text-red-500"
onClick={logout}
>
Logout
</button>
</>
)}

</div>

</div>

</nav>

);

}

export default Navbar;
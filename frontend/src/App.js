import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AddProblem from "./pages/AddProblem";
import ProblemDetails from "./pages/ProblemDetails";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SplashScreen from "./pages/SplashScreen";
import EditProblem from "./pages/EditProblem";

function Layout(){

const location = useLocation();

return (

<div className="bg-gray-100 min-h-screen">

{/* Hide Navbar on Splash Screen */}

{location.pathname !== "/" && <Navbar />}

<Routes>

<Route path="/" element={<SplashScreen />} />

<Route path="/home" element={<Home />} />

<Route path="/add" element={<AddProblem />} />

<Route path="/problem/:id" element={<ProblemDetails />} />

<Route path="/profile" element={<Profile />} />

<Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />

<Route path="/edit/:id" element={<EditProblem />} />
</Routes>

</div>

);

}

function App(){

return(

<BrowserRouter>
<Layout />
</BrowserRouter>

);

}

export default App;
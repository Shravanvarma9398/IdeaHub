import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SplashScreen(){

const navigate = useNavigate();

const tagline = '"A hub where ideas grow into startups."';

const [displayText,setDisplayText] = useState("");

useEffect(()=>{

let i = 0;

const typing = setInterval(()=>{

setDisplayText(tagline.substring(0,i+1));
i++;

if(i === tagline.length){
clearInterval(typing);

setTimeout(()=>{
navigate("/home");
},1500);

}

},50);

return ()=> clearInterval(typing);

},[navigate]);

return(

<div className="flex flex-col items-center justify-center h-screen bg-gray-100">

<h1 className="text-6xl font-bold text-blue-600 mb-6">
IdeaHub
</h1>

<p className="text-xl text-gray-600 h-8">
{displayText}
</p>

</div>

)

}

export default SplashScreen;
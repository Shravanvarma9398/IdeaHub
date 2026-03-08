const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

const Problem = require("./models/Problem");
const Solution = require("./models/Solution");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/problemhub")
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* =============================
   MULTER IMAGE UPLOAD SETUP
============================= */

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "uploads/");
},
filename: function (req, file, cb) {
cb(null, Date.now() + path.extname(file.originalname));
}
});

const upload = multer({ storage });

/* =============================
   AUTH MIDDLEWARE
============================= */

function authMiddleware(req,res,next){

const token = req.headers.authorization;

if(!token){
return res.status(401).json("No token");
}

try{

const verified = jwt.verify(token,"secretkey");

req.user = verified;

next();

}catch(err){

res.status(401).json("Invalid token");

}

}

/* =============================
   TEST ROUTE
============================= */

app.get("/", (req,res)=>{
res.send("IdeaHub API Running");
});

/* =============================
   SIGNUP API
============================= */

app.post("/signup", async (req,res)=>{

try{

const {name,email,password} = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
name,
email,
password:hashedPassword
});

await user.save();

res.json({message:"User created"});

}catch(err){
res.status(500).json(err);
}

});

/* =============================
   LOGIN API
============================= */

app.post("/login", async (req,res)=>{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

const valid = await bcrypt.compare(password,user.password);

if(!valid){
return res.status(400).json({message:"Invalid password"});
}

const token = jwt.sign(
{id:user._id},
"secretkey",
{expiresIn:"1d"}
);

res.json({
token,
user
});

});

/* =============================
   CREATE PROBLEM WITH IMAGE
============================= */

app.post("/problems", authMiddleware, upload.single("image"), async (req,res)=>{

try{

const user = await User.findById(req.user.id);

const problem = new Problem({

title:req.body.title,
description:req.body.description,
category:req.body.category,

userId:user._id,
userName:user.name,
userEmail:user.email,

image:req.file ? req.file.filename : "",

votes:0

});

await problem.save();

res.json(problem);

}catch(err){

console.log(err);
res.status(500).json("Server error");

}

});

/* =============================
   GET ALL PROBLEMS
============================= */

app.get("/problems", async (req,res)=>{

const problems = await Problem.find().sort({ votes: -1 });

res.json(problems);

});

/* =============================
   GET SINGLE PROBLEM
============================= */

app.get("/problems/:id", async (req,res)=>{

try{

const problem = await Problem.findById(req.params.id);

if(!problem){
return res.status(404).json("Problem not found");
}

res.json(problem);

}catch(err){

console.log(err);
res.status(500).json("Server error");

}

});

/* =============================
   DELETE PROBLEM
============================= */

app.delete("/problems/:id", authMiddleware, async (req,res)=>{

const problem = await Problem.findById(req.params.id);

if(problem.userId.toString() !== req.user.id){
return res.status(403).json("Not allowed");
}

await problem.deleteOne();

res.json("Problem deleted");

});

/* =============================
   VOTE PROBLEM
============================= */

app.put("/vote/:id", async (req,res)=>{

const problem = await Problem.findById(req.params.id);

problem.votes += 1;

await problem.save();

res.json(problem);

});

/* =============================
   ADD COMMUNITY SUPPORT
============================= */

app.post("/solutions", authMiddleware, async (req,res)=>{

const user = await User.findById(req.user.id);

const solution = new Solution({

problemId:req.body.problemId,
solutionText:req.body.solutionText,

userId:user._id,
userName:user.name

});

await solution.save();

res.json(solution);

});

/* =============================
   GET ALL SOLUTIONS
============================= */

app.get("/solutions", async (req,res)=>{

const solutions = await Solution.find();

res.json(solutions);

});

/* =============================
   GET SOLUTIONS FOR PROBLEM
============================= */

app.get("/solutions/:problemId", async (req,res)=>{

const solutions = await Solution.find({
problemId:req.params.problemId
});

res.json(solutions);

});

/* =============================
   UPDATE PROBLEM
============================= */

app.put("/problems/:id", authMiddleware, async (req,res)=>{

try{

const problem = await Problem.findById(req.params.id);

if(!problem){
return res.status(404).json("Problem not found");
}

if(problem.userId.toString() !== req.user.id){
return res.status(403).json("Not allowed");
}

problem.title = req.body.title;
problem.description = req.body.description;

await problem.save();

res.json(problem);

}catch(err){
console.log(err);
res.status(500).json("Server error");
}

});

/* =============================
   DELETE SOLUTION
============================= */

app.delete("/solutions/:id", authMiddleware, async (req,res)=>{

const solution = await Solution.findById(req.params.id);

if(solution.userId.toString() !== req.user.id){
return res.status(403).json("Not allowed");
}

await solution.deleteOne();

res.json("Solution deleted");

});

/* =============================
   SERVER START
============================= */

app.listen(5000, ()=>{
console.log("Server running on port 5000");
});
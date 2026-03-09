require("dotenv").config();

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

/* =============================
   SERVE UPLOADED IMAGES
============================= */

app.use("/uploads", express.static("uploads"));

/* =============================
   MODELS
============================= */

const Problem = require("./models/Problem");
const Solution = require("./models/Solution");
const User = require("./models/User");

/* =============================
   MONGODB CONNECTION
============================= */

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* =============================
   MULTER IMAGE UPLOAD
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

const verified = jwt.verify(token, process.env.JWT_SECRET);

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
   SIGNUP
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
   LOGIN
============================= */

app.post("/login", async (req,res)=>{

try{

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
process.env.JWT_SECRET,
{expiresIn:"1d"}
);

res.json({
token,
user
});

}catch(err){
res.status(500).json(err);
}

});

/* =============================
   GET ALL PROBLEMS
============================= */

app.get("/problems", async (req,res)=>{

try{

const problems = await Problem.find().sort({votes:-1});

res.json(problems);

}catch(err){

res.status(500).json(err);

}

});

/* =============================
   ADD PROBLEM
============================= */

app.post("/problems", authMiddleware, upload.single("image"), async (req,res)=>{

try{

const {title,description,category} = req.body;

const user = await User.findById(req.user.id);

const problem = new Problem({
title,
description,
category,
votes:0,
user:req.user.id,
userName:user.name,
userEmail:user.email,
image: req.file ? req.file.filename : null
});

await problem.save();

res.json(problem);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/* =============================
   VOTE PROBLEM
============================= */

app.put("/vote/:id", async (req,res)=>{

try{

const problem = await Problem.findById(req.params.id);

problem.votes += 1;

await problem.save();

res.json(problem);

}catch(err){

res.status(500).json(err);

}

});

/* =============================
   DELETE PROBLEM
============================= */

app.delete("/problems/:id", authMiddleware, async (req,res)=>{

try{

await Problem.findByIdAndDelete(req.params.id);

res.json({message:"Problem deleted"});

}catch(err){

res.status(500).json(err);

}

});

/* =============================
   ADD SOLUTION
============================= */

app.post("/solutions", authMiddleware, async (req,res)=>{

try{

const {problemId, solutionText} = req.body;

const user = await User.findById(req.user.id);

const solution = new Solution({
problemId,
solutionText,
userId:req.user.id,
userName:user.name
});

await solution.save();

res.json(solution);

}catch(err){

res.status(500).json(err);

}

});

/* =============================
   GET SOLUTIONS FOR PROBLEM
============================= */

app.get("/solutions/:problemId", async (req,res)=>{

try{

const solutions = await Solution.find({
problemId:req.params.problemId
}).sort({createdAt:-1});

res.json(solutions);

}catch(err){

res.status(500).json(err);

}

});

/* =============================
   SERVER START
============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`);
});
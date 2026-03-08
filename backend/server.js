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

// serve uploaded images
app.use("/uploads", express.static("uploads"));

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
process.env.JWT_SECRET,
{expiresIn:"1d"}
);

res.json({
token,
user
});

});

/* =============================
   SERVER START
============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
console.log(`Server running on port $ {PORT}`);
});
const mongoose = require("mongoose");

const SolutionSchema = new mongoose.Schema({

problemId:String,
solutionText:String,
userId:String,
userName:String

},{timestamps:true});

module.exports = mongoose.model("Solution",SolutionSchema);
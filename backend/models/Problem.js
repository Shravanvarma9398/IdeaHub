const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({

title:String,
description:String,
category:String,

user:String,          // owner id
userName:String,
userEmail:String,

image:String,

votes:{
type:Number,
default:0
}

},{timestamps:true});

module.exports = mongoose.model("Problem",ProblemSchema);
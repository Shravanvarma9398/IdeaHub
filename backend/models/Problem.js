const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({

title:String,
description:String,
category:String,

userId:String,
userName:String,
userEmail:String,

image:String,

votes:{
type:Number,
default:0
}

});

module.exports = mongoose.model("Problem",ProblemSchema);
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")


let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now
  },
  role: {
    type: String, default: "user"
  },
})
exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (user_id) => {
  let token = jwt.sign({_id:user_id},config.tokenSecret,{expiresIn:"60mins"});
  return token;
}


exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(200).required(),
    email: Joi.string().min(1).max(300).email().required(),
    role: Joi.string().min(1).max(50).allow(),
    password: Joi.string().min(1).max(100).required(),
  })
  return joiSchema.validate(_reqBody)
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(1).max(300).email().required(),
    password: Joi.string().min(1).max(100).required(),
  })
  return joiSchema.validate(_reqBody)
}
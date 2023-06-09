const mongoose = require("mongoose");
const Joi = require("joi");

let toySchema = new mongoose.Schema({
  name: String,
  info: String,
  category: String,
  img_url: String,
  price: Number,
  date_created: {
    type: Date, default: Date.now
  },
  userID: String,
})
exports.ToyModel = mongoose.model("toys", toySchema)

exports.validateToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    info: Joi.string().min(2).max(300).required(),
    category: Joi.string().min(2).max(150).required(),
    img_url: Joi.string().min(2).max(500).required(),
    price: Joi.number().min(1).max(999).required(),
 
  })
  return joiSchema.validate(_reqBody)
}
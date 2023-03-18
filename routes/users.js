const express = require("express");
const bcrypt = require("bcrypt")
const {UserModel, validateUser, validateLogin, createToken} = require("../models/userModel")
const {auth } = require("../middlewares/auth")
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Users work"});
})


/**
 * @swagger
 *  /users/userInfo:
 *  get:
 *      description: User details
 *      parameters:
 *        - name: x-api-key
 *          in: header
 *          description: Add a token
 *          required: true
 *          type: string
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */



router.get("/userInfo",auth, async(req,res) => {
 try{
  let infoUser = await UserModel.findOne({_id: req.tokenData._id}, {password:0})
  return res.json(infoUser)
 }
 catch(err){
  console.log(err);
  res.status(502).json({err})
 }


})


/**
 * @swagger
 * /users:
 *  post:
 *      description: Create a user
 *      parameters:
 *        - name: toy
 *          in: body
 *          description: Adding user details, name, email and password.
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */


// Create a user
router.post("/", async(req,res) => {
  let validBode = validateUser(req.body) 
  if(validBode.error){
    return res.status(400).json(validBode.error.details)
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "****"
    return res.status(200).json(user);
  }  
  catch(err){
    if(err.code == 11000){
     return res.status(400).json({msg: " The email already exists ", code: 11000 })
    }
    console.log(err);
    return res.status(502).json({err})
  }
})


/**
 * @swagger
 * /users/login:
 *  post:
 *      description: User login
 *      parameters:
 *        - name: toy
 *          in: body
 *          description: Added email and password
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */

router.post("/login", async(req,res) => {
  let validBode = validateLogin(req.body) 
  if(validBode.error){
    return res.status(400).json(validBode.error.details)
  }
  try{
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json({msg:"The email or password does not match, try again"})
    }
    let userPass = await bcrypt.compare(req.body.password, user.password)
    if(!userPass){
      return res.status(401).json({err:"password does not match, try again111"});
    }
    let token = createToken(user._id)
    return res.json({token})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;
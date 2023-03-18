const express = require("express");
const {ToyModel, validateToy} = require("../models/toyModel")
const {auth } = require("../middlewares/auth")
const router = express.Router();


// /toy/{pageNamber}
/**
 * @swagger
 *  /toy:
 *  get:
 *      description: Get all toys
 *      parameters:
 *           - in: query
 *             name: page
 *             required: false
 *             description: Represents the page number - by defauly is 1.
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */


router.get("/", async(req,res) => {
  let perPage = 10;
  let page = req.query.page -1 || 0;
try{
  let data = await ToyModel
  .find({})
  .limit(perPage)
  .skip(page * perPage)
  return  res.json(data)
}
catch(err){
  console.log(err);
  return  res.status(502).json({err})
}
})


// /toy/{search}
/**
 * @swagger
 *  /toy/search:
 *  get:
 *      description: Get search toys
 *      parameters:
 *           - in: query
 *             name: search
 *             required: false
 *             description: Search by product name or product information
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */


// search
router.get("/search", async(req,res) =>{
  try{
    let search = req.query.search;
    let searchExp = new RegExp(search,"i");
    let data = await ToyModel.find({$or:[{name: searchExp}, {info: searchExp}]}).limit(10);
   return res.json(data)
  }
  catch(err){
    console.log(err);
    return res.status(502).json({err})
  }
})

// /toy/{search}
/**
 * @swagger
 *  /toy/price:
 *  get:
 *      description: Search by price
 *      parameters:
 *           - in: query
 *             name: min
 *             required: false
 *             description: Minimum amount
 *           - in: query
 *             name: max
 *             required: false
 *             description: Maximum amount
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */


router.get("/price", async(req,res) =>{
  try{
    let min = req.query.min;
    let max = req.query.max; 
    let data = await ToyModel.find({price: { $gte: min ,$lte: max }}).limit(10);
    console.log(data);
   return res.json(data)
  }
  catch(err){
    console.log(err);
    return res.status(502).json({err})
  }
})

// /toy/{index}
/**
 * @swagger
 * /toy/{index}:
 *  get:
 *      description: Get specifiec toy details
 *      parameters:
 *           - in: path
 *             name: index
 *             required: true
 *             description:
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */


// single
router.get("/:index", async(req, res) => {
  let index = req.params.index;
  try{
      let toys_arr = await ToyModel.find();
      console.log(toys_arr[index]);
      
       return res.json(toys_arr[index]);
  }  
  catch(err){
      console.log(err);
      return res.status(502).json({err,msg:"error in our server come back later"})
  }
})

/**
* @swagger
* /toy/category/{category}:
*   get:
*     description: Product search by category
*     parameters:
*           - in: path
*             name: category
*             required: true
*             description:
*     responses:
*          '200':
*              description: A successful response
*          '500':
*               description: Internal Server Error 
*/


// category
router.get("/category/:category", async(req, res) => {
  try{
      let category = req.params.category;
      let toys_arr = await ToyModel.find({category: category }).limit(10);
      return res.json(toys_arr);
  }
  catch(err){
      console.log(err);
      res.status(502).json({err})
  }

})



// Requests with login

/**
 * @swagger
 *  /toy/:
 *  post:
 *      description: Adding a product
 *      parameters:
 *        - name: x-api-key
 *          in: header
 *          description: Add a token
 *          required: true
 *          type: string
 *        - name: toy
 *          in: body
 *          description: Details about the product
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                  type: string
 *              info:
 *                  type: string
 *              category:
 *                  type: string
 *              img_url:
 *                  type: string
 *              price:
 *                  type: integer
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */


router.post("/",auth , async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new ToyModel(req.body);
    toy.userID = req.tokenData._id;
    await toy.save();
    return res.json(toy)
  }
  catch(err){
    console.log(err);
   return res.status(502).json({err})
  }
})

/**
 * @swagger
 *  /toy/{id}:
 *  put:
 *      description: Update product details
 *      parameters:
 *        - name: x-api-key
 *          in: header
 *          description: Add a token
 *          required: true
 *          type: string
 *        - in: path
 *          description: Product ID
 *          name: id
 *          required: true
 *          type: string
 *        - name: toy
 *          in: body
 *          description: Update product details
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                  type: string
 *              info:
 *                  type: string
 *              category:
 *                  type: string
 *              img_url:
 *                  type: string
 *              price:
 *                  type: integer
 * 
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */

router.put("/:id", auth,async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let id = req.params.id;
    let data = await ToyModel.updateOne({_id:id,userID:req.tokenData._id},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


/**
 * @swagger
 *  /toy/{id}:
 *  delete:
 *      description: Delete a product by ID
 *      parameters:
 *        - name: x-api-key
 *          in: header
 *          description: Add a token
 *          required: true
 *          type: string
 *        - name: id
 *          in: path
 *          description: Product ID
 *      responses:
 *          '200':
 *              description: A successful response
 *          '500':
 *              description: Internal Server Error 
 */

router.delete("/:id", auth, async(req,res) => {
  try{
    let id = req.params.id;
    let data = await ToyModel.deleteOne({_id:id, userID:req.tokenData._id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")
exports.auth = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You must send token to this endpoint  "});
  }
  try{
    let codeToken = jwt.verify(token,config.tokenSecret);
    req.tokenData = codeToken;
    next();
  }
  catch(err){
    res.status(401).json({err:"Token invalid or expired "})
  }
}
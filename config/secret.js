require("dotenv").config();
console.log(process.env.TOKENSECRET)
exports.config = {
    mongoUser:process.env.DBUSER,
    mongoPass:process.env.DBPASS,
    tokenSecret:process.env.TOKENSECRET,
  
  }
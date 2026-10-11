const jwt=require("jsonwebtoken");
const makeToken=(user)=>{
   return jwt.sign(
        {id:user.id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES || "2d"}
);}
module.exports=makeToken;

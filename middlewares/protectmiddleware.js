import jwt from "jsonwebtoken";
import  User from "./../models/User.js";

export const protect=async(req,res,next)=>{

    const authHeader=req.headers.authorization
    const token=authHeader&&authHeader.startsWith("Bearer")?authHeader.split(" ")[1]:null


    if(!token) return res.status(401).json({message:"token not found"})
try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET)

        const user=await User.findById(decoded._id)
        req.user=user
         next()
}
catch(error){
    res.status(401).json({message:"User not Authorized"})
}

}


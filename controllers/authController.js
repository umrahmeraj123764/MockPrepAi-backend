import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken=(_id)=>{ return jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:"7d"})} 

export const registerUser= async(req,res)=>{  
    const {name,email,password} =req.body

    if(!name||!email||!password) return res.status(400).json({message:"enter all details"})

        const userPresent=await User.findOne({email})
    if(userPresent) return res.status(201).json({message:"user already exists"})

        const hashedPassword=await bcrypt.hash(password,10)

        const user= await User.create({
            name,
            email,
            password:hashedPassword,
        })
        
        res.status(201).json({
            _id:user._id,
            name,
            email,
            token:generateToken(user._id)
        })
    }

    export const loginUser=async(req,res)=>{
        const {email,password}=req.body
        if(!email||!password) return res.status(400).json({message:"enter all details"})

        const userPresent=await User.findOne({email})
        if(!userPresent) return res.status(400).json({message:"email does not exists"})

        const isMatch= await bcrypt.compare(password,userPresent.password)
        if(!isMatch) return res.status(400).json({message:"credentials not found"})

            res.status(200).json({                     
                _id:userPresent._id, 
                name:userPresent.name,
                email:userPresent.email,
                token:generateToken(userPresent._id)
            })
    }



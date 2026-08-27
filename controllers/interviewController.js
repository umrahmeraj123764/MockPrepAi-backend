import Session from "../models/Session.js";
import Groq from "groq-sdk";



export const startInterview=async (req,res)=>{
   try{
     const groq= new Groq ({apiKey:process.env.GROQ_API_KEY})
    const {role,type}=req.body
    
    if(!role||!type) return res.status(400).json({message:"doesnt exist"})

        const response =await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
        messages: [{role:"user" , content: `Generate 5 ${type} interview question for ${role}.Return only a JSON array with no extra text like:["question1", "question2","question3", "question4","question5"]`}]

        })
        const result= response.choices[0].message.content;
        const parsed = JSON.parse(result)
        const session = await Session.create({
            userId:req.user._id,
            role,type,
            questions:parsed
        })
        res.status(201).json(session)
    } catch (error) {
        console.error("Groq error:", error);
        res.status(500).json({ message: "Failed to start interview session" });
    }
};



export const giveResponse=async(req,res)=>{
    const groq= new Groq ({apiKey:process.env.GROQ_API_KEY})
    const {sessionId,question,answer}=req.body
    try{
    const response=await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages:[{
        role:"user",
        content:`question:${question}
        answer:${answer} Give a score out of 10 and a genuine feedback . return only JSON like:{"score":7,"feedback":"good but....."}`
    }]
    })  
const result=response.choices[0].message.content
console.log("result:",result)
const parsed=JSON.parse(result)
const session= await Session.findByIdAndUpdate( sessionId ,
    { $push: {
            answers:answer,
            feedback:parsed.feedback,
            score:parsed.score
        }
    },
        {new:true}
    )
    

res.status(200).json({
    feedback:parsed.feedback,
    score:parsed.score
    })

}
catch(error){
    console.log(error)
    res.status(500).json({message:"response not found"})
}
}
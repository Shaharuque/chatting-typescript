import { RequestHandler } from "express";
import User from "../model/User";

//search users
// /api/user/all?search=amin
// /api/user:id =>we use req.param.id
export const allUsers:RequestHandler=async(req,res)=>{
    try{
        // const keyword=req.query.search
        // console.log(keyword)
        // // const users=await User.find()
        // //find user if email or name matches
        // const users=await User.find({$or: [
        //     { name: keyword },
        //     { email: keyword }
        //   ]})
        // res.status(200).json(users)
        const keyword = req.query.search
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};

        //logged in user badh a jara thakbey tader data show
        // console.log('logged in user _id',req.user.id)
        const users=await User.find(keyword).find({_id:{$ne:req.user.id}})

        res.status(200).json(users)
    
    }catch(err){
        res.status(500).json({
            message:"error",
            err
        })
    }
}

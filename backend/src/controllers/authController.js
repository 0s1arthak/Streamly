import User from "../models/User.js";
import bcrypt from "bcrypt"
import { generateAndSendOtp } from "../services/otpService.js";
import Otp from "../models/Otp.js";
import { hashOtp } from "../utils/hash.js";
import TempUser from "../models/TempUser.js";


// User will not be created until the otp is verified 

export const signup=async(req,res)=>{
    try {
        // Extracting credentials
        const {name,email,password,confirmPassword}=req.body;
        const existingUser=User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        if(password!==confirmPassword){
            return res.json({message:"Password does not match"})
        }
        const hashedPassword=await bcrypt.hash(password,process.env.SALT_ROUNDS);

        // Create a temporary user that will automatically be deleted after 10 minutes
        const tempUser=await TempUser.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        console.log(tempUser)

        // Sending otp when registering and user will not be saved until otp is verified
        generateAndSendOtp(email)

        return res.json({
            message:"OTP is sent to your email",
            email:email
        })


    } catch (error) {
        return res.status(500).json({message:`${error.message}`})
    }
}


export const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;

        // first find the otp with this email

        const otpModel=await Otp.findOne({email});

        if(!otpModel){
            return res.status(400).json({message:"OTP does not exist , please signup again"})
            
        }

        // hash and check the value stored inside
        const hashedOtp=hashOtp(otp);
        if(hashedOtp!==otpModel.value){
            // Error
            return res.json({message:"Try again"})
        }
        const tempUser=await TempUser.findOne({email});
        if(!tempUser){
            return res.status(400).json({message:"Cannot find the user"});
        }

        const user=await User.create({
            name:tempUser.name,
            email:email,
            password:tempUser.password,
        })

        // Delete user and otp(temporary ones)
        await TempUser.deleteOne({ email });
        await Otp.deleteOne({ email });

        console.log(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:`${error.message}`});
        
    }
    

}
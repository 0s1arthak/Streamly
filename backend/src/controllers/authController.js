import User from "../models/User.js";
import bcrypt from "bcrypt"
import { generateAndSendOtp } from "../services/otpService.js";
import Otp from "../models/Otp.js";
import { hashOtp } from "../utils/hash.js";
import TempUser from "../models/TempUser.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"


// User will not be created until the otp is verified 

dotenv.config();

export const signup=async(req,res)=>{
    try {
        // Extracting credentials
        const {name,email,password,confirmPassword}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        if(password!==confirmPassword){
            return res.json({message:"Password does not match"})
        }
        const salt=Number(process.env.SALT_ROUNDS)
        const hashedPassword=await bcrypt.hash(password,salt);

        // Check if temp user already exists (maybe OTP expired)
        let tempUser = await TempUser.findOne({ email });

        if (!tempUser) {
            tempUser = await TempUser.create({
                name,
                email,
                password: hashedPassword
            });
        } else {
            // Update existing temp user details (optional)
            tempUser.name = name;
            tempUser.password = hashedPassword;
            await tempUser.save();
        }
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


        const isMatch = await bcrypt.compare(String(otp), otpModel.value);
        if (!isMatch) {
            console.log("OTP mismatch");
            return res.json({ message: "Try again" });
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
        return res.status(200).json({message:"Otp verified successfully , log in to continue",email});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:`${error.message}`});
        
    }
    

}

// So basically the flow would be as follows , when the user will try to sign up , he will first give
// his email id and password , a temp user will be created and from backend email is being sent to frontend
// email would be saved in a state or localStorage and later it would be used by the Otp page then
// the user would enter the otp sent on the email , and if the otp entered by the user is wrong , then 
// at the frontend he would again be told to enter the otp, and then
// another case is that if otp gets expired, then it would be deleted so if user enters the otp which is deleted
// from db he would be required to enter the new otp and verifyOtp function would get called 


export const resendOtp=async(req,res)=>{
    try {
        const {email}=req.body;


        // Checking whether the user has expired or not 
        const tempUser=await TempUser.findOne({email});
        if(!tempUser){
            return res.status(400).json({
                message:"Signup session expired, please signup again"
            });
        }
        

        // Generating and sending new otp (as previous one got deleted)
        await generateAndSendOtp(email);

        return res.status(200).json({
            message:"New Otp sent to your email",
            email
        })

    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body

        const existingUser=await User.findOne({email});

        if(!existingUser){
            return res.status(400).json({message:"User does not exist"});
        }

        const isMatch=await bcrypt.compare(password,existingUser.password);
        console.log(isMatch)
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }
        const token=jwt.sign(
            {userId:existingUser._id,email:existingUser.email},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );

        return res.json({
            message:"User logged in successfully",
            token,
            user:{
                name:existingUser.name,
                email:existingUser.email
            }
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
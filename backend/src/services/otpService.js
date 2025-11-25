import { generateSixDigitsOtp } from "../utils/random.js";
import { hashOtp } from "../utils/hash.js";
import Otp from "../models/Otp.js";
import { sendOtp } from "../providers/email.provider.js";

export const generateAndSendOtp=async(email)=>{

    // generating
    const value=generateSixDigitsOtp();

    // hashing
    const hashedOtp=await hashOtp(value);

    // Generating model for otp
    const otpValue=await Otp.create({
        email:email,
        value:hashedOtp
    })


    // sending email through nodemailer
    await sendOtp(email,value)
}
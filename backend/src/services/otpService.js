import { generateSixDigitsOtp } from "../utils/random.js";
import { hashOtp } from "../utils/hash.js";
import Otp from "../models/Otp.js";
import { sendOtp } from "../providers/email.provider.js";

export const generateAndSendOtp=async(user)=>{

    // generating
    const value=generateSixDigitsOtp();

    // hashing
    const hashedOtp=hashOtp(value);

    // Generating model for otp
    const otpValue=await Otp.create({
        email:user.email,
        value:hashedOtp
    })


    // sending email through nodemailer
    await sendOtp(user.email,value)
}
import bcrypt from "bcrypt"


export const hashOtp=async(otp)=>{
    const hashedOtp=await bcrypt.hash(otp,10);
    return hashedOtp
}
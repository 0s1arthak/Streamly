import express from "express"


import { signup,verifyOtp,resendOtp } from "../controllers/authController.js"


const router=express.Router();

// Signup route
router.post("/signup",signup)


// verify otp route
router.post("/verify-otp",verifyOtp);


// resend otp route
router.post("/resend-otp",resendOtp);



export default router
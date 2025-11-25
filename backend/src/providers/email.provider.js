import nodemailer from "nodemailer"
import dotenv from "dotenv"


dotenv.config()


const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const sendEmail=async(to,subject,text,html=null)=>{
    const mailOptions={
        from:`"My App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    }
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Email sent:", response.messageId);
        return response;
    } catch (error) {
        console.log("Email error:", error);
        throw error;
    }
}

export const sendOtp=async(email,otp)=>{
    const subject="Your Otp code";
    const text=`Your otp code is ${otp}.It expires in 5 minutes.`
    const html=`<p>Your OTP is: <b>${otp}</b></p>`
    await sendEmail(email,subject,text,html)
}
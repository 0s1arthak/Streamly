import nodemailer from "nodemailer"


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
}

export const sendOtp=async(email,otp)=>{
    const subject="Your Otp code";
    const text=`Your otp code is ${otp}.It expires in 5 minutes.`
    const html=`<p>Your OTP is: <b>${otp}</b></p>`
    await sendEmail(email,subject,text,html)
}
import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String, // hashed
    createdAt: { type: Date, default: Date.now, expires: 600 } // auto-delete after 10 mins
});

export default mongoose.model("TempUser", tempUserSchema);
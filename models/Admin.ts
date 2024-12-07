import mongoose, { Schema, Document } from "mongoose";


export interface IAdmin extends Document {
    name: string;
    password: string;
    email: string;
    mobile: string;
    otp?: string;
    otpExpire?: Date;
}


const adminSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        otp: { type: String, required: false },
        otpExpire: { type: Date, required: false },
    }, { timestamps: true });


const Admin = mongoose.model<IAdmin>("admin", adminSchema);
export default Admin;

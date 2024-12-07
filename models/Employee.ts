import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
    name?: string;
    mobile: string;
    email?: string;
    otp?: string;
    role: 'admin' | 'employee';
    isBlock: boolean;

}

const employeeSchema: Schema = new mongoose.Schema(
    {
        name: { type: String },
        mobile: { type: String, required: true },
        email: { type: String },
        otp: { type: String },
        role: {
            type: String,
            enum: ['admin', 'employee'],
            default: 'employee',
        },
    },
    { timestamps: true }
);

export default mongoose.model<IEmployee>("employee", employeeSchema);

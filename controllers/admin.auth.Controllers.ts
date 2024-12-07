import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import validator from "validator";
import Admin, { IAdmin } from "../models/Admin";
import checkEmpty from "../utils/checkEmpty";



// Register Admin
export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body);

    const hash = await bcrypt.hash(req.body.password, 10);
    const admin: IAdmin = await Admin.create({ ...req.body, password: hash });

    res.json({
        message: "Super Admin Register Success",
        result: admin.email,
    });
});

// Login Admin
export const loginAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobile } = req.body;

    const { isError, error } = checkEmpty({ mobile });
    if (isError) {
        res.status(400).json({ message: error });
        return;
    }

    if (!validator.isMobilePhone(mobile.toString(), "any")) {
        res.status(400).json({ message: "Invalid Mobile Number" });
        return;
    }

    const result = await Admin.findOne({ mobile });
    if (!result) {
        res.status(404).json({ message: "Mobile Number Not Found" });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Admin.findByIdAndUpdate(result._id, {
        otp,
        otpExpire: new Date(Date.now() + 1000 * 60 * 3),
    });

    res.json({
        message: "OTP generated successfully and saved in the database.",
        result: { mobile, otp },
    });
});

// Verify OTP
export const verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { otp, mobile } = req.body;

    const { isError, error } = checkEmpty({ otp, mobile });
    if (isError) {
        res.status(400).json({ message: "Provide OTP and mobile", error });
        return;
    }

    if (!validator.isMobilePhone(mobile, "en-IN")) {
        res.status(400).json({ message: "Invalid OTP Or Mobile", error: "Invalid OTP Or Mobile" });
        return;
    }

    const result = await Admin.findOne({ mobile });
    if (!result) {
        res.status(400).json({ message: "OTP Or Mobile is not found", error: "OTP Or Mobile is not found" });
        return;
    }

    if (otp !== result.otp) {
        res.status(403).json({ message: "Invalid OTP" });
        return;
    }

    if (result.otpExpire && result.otpExpire < new Date()) {
        await Admin.findByIdAndUpdate(result._id, { otp: "" });
        res.status(410).json({ message: "OTP Expired, Login Again" });
        return;
    }

    await Admin.findByIdAndUpdate(result._id, { otp: "" });

    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY as string, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("admin", token, {
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_EXPIRE as string, 10),
        secure: process.env.NODE_ENV === "production",
    });

    res.json({
        message: "Login Success, OTP Verified",
        result: {
            _id: result._id,
            name: result.name,
            mobile: result.mobile,
        },
    });
});







// Logout Admin
export const logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("admin");
    res.json({ message: "Admin Logout Success" });
});

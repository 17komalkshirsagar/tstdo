import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import checkEmpty from "../utils/checkEmpty";
import Employee from "../models/Employee";

// Logout Employee
export const logoutEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("employee");
    res.json({ message: "User Logout Success" });
});

// Login Employee
export const loginEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobile }: { mobile: string } = req.body;

    const employee = await Employee.findOne({ mobile });

    const otp = Math.floor(10000 + Math.random() * 900000).toString();

    if (!employee) {
        await Employee.create({ mobile, otp });
        res.json({ message: "OTP sent for Employee registration", result: mobile });
        return;
    }

    await Employee.findByIdAndUpdate(employee._id, { otp, lastLogin: new Date() });
    console.log(`Employee ${mobile} logged in. Last login updated to: ${new Date()}`);

    res.status(200).json({ message: "OTP sent successfully for login", result: mobile });
});


// Verify OTP for Employee
export const verifyOTPEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { otp, mobile }: { otp: string; mobile: string } = req.body;

    const { isError, error } = checkEmpty({ mobile, otp });
    if (isError) {
        res.status(401).json({ message: "All Fields required", error });
        return;
    }

    const employee = await Employee.findOne({ mobile });
    if (!employee) {
        res.status(401).json({ message: "Employee Not Found" });
        return;
    }

    if (otp !== employee.otp) {
        res.status(401).json({ message: "Invalid OTP" });
        return;
    }

    await Employee.findByIdAndUpdate(employee._id, { lastLogin: new Date() });

    const token = jwt.sign({ employeeId: employee._id }, process.env.JWT_KEY as string, { expiresIn: "1d" });
    res.cookie("employee", token, {
        maxAge: 86400000, // 1 day
        httpOnly: true,
    });

    res.json({
        message: "OTP Verify Success.",
        result: {
            mobile: employee.mobile,
            _id: employee._id,
            lastLogin: new Date(),
        },
    });
});

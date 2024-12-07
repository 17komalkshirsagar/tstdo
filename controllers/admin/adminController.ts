import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Employee from '../../models/Employee';
import sendEmail from '../../utils/email';

export const registerEmployeeAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, mobile, email, role } = req.body;
    const employee = await Employee.create({ name, mobile, email, role })
    await sendEmail(email, 'Todo Registration Success', 'Welcome to SKILLHUB Employee');
    res.status(201).json({ message: 'Employee registered successfully', employee });
});




export const getAdminEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await Employee.find()
    res.json({ message: "get Admin Enquire Success", result })
})

export const updateEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.id, req.body);
    await Employee.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: "Update Admin Update Employee Success" })
})
export const deleteEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await Employee.findByIdAndDelete(req.params.id)
    res.json({ message: "Delete Admin  Delete Employee Success" })
})

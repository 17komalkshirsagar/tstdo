import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Employee from "../models/Employee";

interface DecodedJWT extends JwtPayload {
    employeeId: string;
    role: string;
    exp?: number;
    isBlock: boolean;
}


export const employeeProtected = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { employee }: { employee?: string } = req.cookies;
    console.log(employee)


    if (!employee) {
        res.status(401).json({ message: "Employee session expired. Please re-login." });
        return;
    }

    jwt.verify(employee, process.env.JWT_KEY as string, async (err, decoded) => {
        if (err) {
            console.error(err);
            res.status(400).json({ message: "JWT Error", error: err.message });
            return;
        }

        const { employeeId, role, exp } = decoded as DecodedJWT;

        if (exp && Date.now() >= exp * 1000) {
            res.status(401).json({ message: "Token has expired. Please re-login." });
            return;
        }

        const loggedInEmployee = await Employee.findById(employeeId);

        if (!loggedInEmployee) {
            res.status(401).json({ message: "Protected employee not found." });
            return;
        }

        if (loggedInEmployee.isBlock) {
            res.status(401).json({ message: "You are blocked by the admin." });
            return;
        }

        if (role !== "employee") {
            res.status(403).json({ message: "Unauthorized access. Insufficient permissions." });
            return;
        }
        (req as any).loggedInEmployee = {
            id: loggedInEmployee._id,
            role: loggedInEmployee.role,
        };
        next();
    });
};

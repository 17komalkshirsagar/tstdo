import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}

interface JwtPayload {
    userId: string;
}

export const adminProtected = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { admin } = req.cookies;

        console.log(admin);

        if (!admin) {
            res.status(401).json({ message: "No Cookie Found" });
            return;
        }

        try {
            const decoded = jwt.verify(admin, process.env.JWT_KEY as string) as JwtPayload;
            if (!decoded) {
                res.status(401).json({ message: "Invalid JWT" });
                return;
            }

            req.body.userId = decoded.userId;
            req.user = decoded.userId;

            next();
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(401).json({ message: err.message || "JWT ERROR" });
            } else {
                res.status(401).json({ message: "JWT ERROR" });
            }
            return;
        }
    }
);

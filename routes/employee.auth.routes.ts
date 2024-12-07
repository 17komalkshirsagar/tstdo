import { Router } from "express";
import * as employeeAuthController from "../controllers/employee.auth.Controller";

const router: Router = Router();

// Employee Aurth routes
router
    .post("/login-employee", employeeAuthController.loginEmployee)
    .post("/verify-otp-employee", employeeAuthController.verifyOTPEmployee)
    .post("/logout-employee", employeeAuthController.logoutEmployee);


export default router;

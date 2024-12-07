import { Router } from "express";
import * as authController from "./../controllers/admin.auth.Controllers";

// const router = Router();
const router: Router = Router();
// Admin routes
router
    .post("/register-admin", authController.registerAdmin)
    .post("/login-admin", authController.loginAdmin)
    .post("/verify-otp-admin", authController.verifyOTP)
    .post("/logout-admin", authController.logoutAdmin);

export default router;

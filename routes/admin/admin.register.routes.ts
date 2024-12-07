import { Router } from "express";
import * as adminEmployeeController from "./../../controllers/admin/adminController";

// const router = Router();
const router: Router = Router();
// Admin routes
router
    .post("/register-employee-admin", adminEmployeeController.registerEmployeeAdmin)
    // .get('/getall-employees', adminEmployeeController.getAdminEmployee)
    .get('/getall-employees', adminEmployeeController.getAdminEmployee)

    .put('/update/employees/:id', adminEmployeeController.updateEmployee)
    .delete('/delete/employees/:id', adminEmployeeController.deleteEmployee)
export default router;

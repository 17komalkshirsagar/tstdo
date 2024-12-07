
import express, { Request, Response, Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({ path: path.resolve(__dirname, "./.env") });
// import { app, server } from "./socket";
//Routes
import adminAuthRoutes from "./routes/admin.auth.routes";
import employeeAuthRoutes from "./routes/employee.auth.routes";

import employeeAdminRoutes from "./routes/admin/admin.register.routes";
import todoRoutes from "./routes/todo.routes";
import employeeRoutes from "./routes/admin/admin.register.routes";
import { adminProtected } from "./middleware/adminProtected";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL as string)
const app: Application = express();

// Middleware

app.use(express.json())
app.use(express.static("uploads"))
app.use(express.static("public"))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser());
// Routes

app.use("/api/auth", adminAuthRoutes);
app.use("/api/employee", employeeAuthRoutes);

app.use("/api/admin/employee", employeeRoutes);
app.use("/api/admin/register", adminProtected, employeeAdminRoutes);
app.use("/api/todo", todoRoutes);





// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Resource Not Found" });
});

// Start the server

mongoose.connection.once("open", () => {
    console.log("MONGO_CONNECTED")
    app.listen(process.env.PORT || 5000, () => console.log("SERVER RUNNING"));
    // httpServer.
});

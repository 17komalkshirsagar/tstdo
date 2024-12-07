import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import TodoModel from "../models/Todo";
import Employee from "../models/Employee";
import { uploadProfile } from "../utils/upload";
import { io } from "../socket/socket";


// export const addTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {

//     const { task, desc, role, skills, gender, avatar, address, education, isDeleted, isBlock, blockReason,
//         lastLogin, employeeId } = req.body;

//     uploadProfile(req, res, async (err: any) => {
//         try {
//             if (err) {
//                 return res.status(400).json({ message: err.message || "Unable to upload image" });
//             }
//             if (!req.file) {
//                 res.status(400).json({ message: "No file uploaded" });
//                 return;
//             }

//             const employee = await Employee.findById(employeeId);
//             console.log('employeeId:', employeeId);
//             if (!employeeId) {
//                 return res.status(400).json({ message: "Employee ID is required" });
//             }
//             if (!employee) {
//                 res.status(404).json({ message: 'Employee not found' });
//                 return;
//             }

//             const newTodo = new TodoModel({
//                 task,
//                 desc,
//                 role,
//                 skills,
//                 gender,
//                 avatar: req.file.filename,
//                 address,
//                 education,
//                 active: true,
//                 isDeleted,
//                 isBlock,
//                 blockReason,
//                 lastLogin,
//                 employeeId,
//             });

//             await newTodo.save();
//             res.status(201).json({ message: 'Todo created successfully', todo: newTodo });
//         } catch (error: unknown) {
//             console.error((error as Error).message);
//             res.status(500).json({ message: 'Error creating Todo', error: (error as Error).message });
//         }
//     });
// });


export const addTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    uploadProfile(req, res, async (err: any) => {
        try {
            if (err) {
                return res.status(400).json({ message: err.message || "Unable to upload image" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            console.log(req.body)


            const { employeeId, task, desc, role, skills, gender, address, education, isDeleted, isBlock, blockReason, lastLogin } = req.body;

            if (!employeeId) {
                return res.status(400).json({ message: "Employee ID is required" });
            }

            const employee = await Employee.findById(employeeId);
            console.log('employeeId:', employeeId);
            if (!employee) {
                res.status(403).json({ message: 'Employee not found' });
                return;
            }

            const newTodo = new TodoModel({
                task,
                desc,
                role,
                skills,
                gender,
                avatar: req.file.filename,
                address,
                education,
                active: true,
                isDeleted,
                isBlock,
                blockReason,
                lastLogin,
                employeeId,
            });

            await newTodo.save()
            // const result = await TodoModel.find() //add new for socket
            // io.emit("todofeatch", result) //ad new socket
            res.status(201).json({ message: 'Todo created successfully', todo: newTodo });
        } catch (error: unknown) {
            console.error((error as Error).message);
            res.status(500).json({ message: 'Error creating Todo', error: (error as Error).message });
        }
    });
});



// Get Todo by ID 
export const getTodoById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const todo = await TodoModel.findById(id).populate('employeeId');
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        res.status(200).json({ message: 'Todo fetched successfully', todo });
        return;
    } catch (error: unknown) {
        console.error((error as Error).message);
        res.status(500).json({ message: 'Error fetching Todos', error: (error as Error).message });;
        return
    }
});

// export const updateTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     const { task, desc, role, skills,
//         gender, avatar, address, education, isDeleted, isBlock, blockReason, lastLogin, employeeId } = req.body;

//     try {
//         const employee = await Employee.findById(employeeId);
//         console.log(employeeId);

//         if (!employee) {
//             res.status(404).json({ message: 'Employee not found' });
//             return;
//         }


//         const updatedTodo = await TodoModel.findByIdAndUpdate(id, {
//             task,
//             desc,
//             role,
//             skills,
//             gender,
//             avatar,
//             address,
//             education,
//             isDeleted,
//             isBlock,
//             blockReason,
//             lastLogin,
//             employeeId,
//         }, { new: true });

//         if (!updatedTodo) {
//             res.status(404).json({ message: 'Todo not found' });
//             return
//         }

//         res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
//         return;
//     } catch (error: unknown) {
//         console.error((error as Error).message);
//         res.status(500).json({ message: 'Error fetching Todos', error: (error as Error).message });;
//         return
//     }
// })
export const updateTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log('Request Body:', req.body);
    console.log('Request Headers:', req.headers);

    const { id } = req.params;
    const { task, desc, role, skills, gender, avatar, address, education, isDeleted, isBlock, blockReason, lastLogin, employeeId } = req.body;

    console.log('Employee ID:', employeeId);

    if (!employeeId) {
        res.status(400).json({ message: "Employee ID is required" });
        return
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id,
            {
                task,
                desc,
                role,
                skills,
                gender,
                avatar,
                address,
                education,
                isDeleted,
                isBlock,
                blockReason,
                lastLogin,
                employeeId,
            },
            { new: true }
        );

        if (!updatedTodo) {
            res.status(404).json({ message: 'Todo not found' });
            return
        }

        res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error: unknown) {
        console.error((error as Error).message);
        res.status(500).json({ message: 'Error updating Todo', error: (error as Error).message });
    }
});



export const getTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await TodoModel.find().populate('employeeId');
    res.json({ message: "get Admin Enquire Success", result })
})

export const deleteTodo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await TodoModel.findByIdAndDelete(req.params.id)
    res.json({ message: "Todo deleted successfully" })
})

import { Router } from "express";
import * as todoController from "../controllers/todo.Controller";

const router: Router = Router();
router

    .get('/todos', todoController.getTodo)
    .post('/add/todos', todoController.addTodo)

    .get('/todos/:id', todoController.getTodoById)
    .delete('/delete-todos/:id', todoController.deleteTodo)
    .put('/todos/:id', todoController.updateTodo)

export default router;
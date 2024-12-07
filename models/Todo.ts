import { Schema, model, Document } from 'mongoose';

// Define the interface for the Todo document
interface Todo {
    role: 'admin' | 'employee';
    skills: string[];
    gender: 'male' | 'female' | 'other';
    task: string;
    desc: string;
    avatar: string;
    address: string;
    education: string[];
    active: boolean;
    isDeleted: boolean;
    blockReason?: string;
    isBlock: boolean;
    lastLogin?: Date;
    name?: string;
    employeeId: Schema.Types.ObjectId;
}


const todoSchema = new Schema<Todo>({
    name: { type: String },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
        required: true,
    },
    skills: {
        type: [String],
        default: ['JavaScript', 'Node.js', 'MongoDB'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    task: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    address: {
        type: String,
    },
    education: {
        type: [String],
        required: true,
        default: ['MCA'],
    },
    active: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    blockReason: {
        type: String,
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    lastLogin: { type: Date, },
    employeeId: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
}, { timestamps: true });


const TodoModel = model<Todo>('todo', todoSchema);

export default TodoModel;

import multer, { StorageEngine } from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const profileStorage: StorageEngine = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fn = uuid() + ext;
        cb(null, fn)
    },
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
});

export const uploadProfile = multer({ storage: profileStorage }).single("avatar");

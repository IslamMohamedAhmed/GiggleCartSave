import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { resolve } from "path";
import { v4 as uuidv4 } from 'uuid';

export const localMulterOptions = (path: string, validations: string[], fileSize?: number): MulterOptions => {
    let basePath = "./uploads/" + path;
    return {
        storage: diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: Function) => {
                let fullPath = resolve(`${basePath}/${req['user']._id}`);
                if (!existsSync(fullPath)) {
                    mkdirSync(fullPath, { recursive: true });
                }
                cb(null, fullPath);
            },
            filename: (req, file, cb) => {
                const uniqueName = uuidv4() + '-' + file.originalname;
                file['finalPath'] = `${basePath}/${req['user']._id}/${uniqueName}`;
                cb(null, uniqueName);
            }
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
            if (!validations.includes(file.mimetype)) {
                cb(new BadRequestException('Invalid File types!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: fileSize || 5 * 1024 * 1024, // Default to 5MB
        },

    }
}
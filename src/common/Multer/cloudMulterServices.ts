import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { diskStorage } from "multer";

export const cloudMulterOptions = (validations: string[], fileSize?: number): MulterOptions => {
    return {
        storage: diskStorage({}),
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
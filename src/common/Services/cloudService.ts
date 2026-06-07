import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
@Injectable()
export class CloudService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
    }

    async uploadFile(file: Express.Multer.File, options?: UploadApiOptions): Promise<UploadApiResponse> {
        return await cloudinary.uploader.upload(file.path, options);
    }

    async uploadFiles(files: Express.Multer.File[], options?: UploadApiOptions): Promise<IAttachments[]> {
        let attachments: IAttachments[] = [];
        for (const file of files) {
            const { secure_url, public_id } = await this.uploadFile(file, options);
            attachments.push({ secure_url, public_id });
        }
        return attachments;
    }

    async deleteFile(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }

    async deleteFiles(publicIds: string[], options?: UploadApiOptions): Promise<void> {
        return await cloudinary.api.delete_resources(publicIds, options || {
            resource_type: 'image',
            type: 'upload',
        });
    }

    async deleteFolderAssets(folderPath: string): Promise<void> {
       return await cloudinary.api.delete_resources_by_prefix(folderPath);
    }
}

export interface IAttachments {
    secure_url: string;
    public_id: string;
}
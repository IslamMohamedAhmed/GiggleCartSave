import { Transporter } from './../../../node_modules/@types/nodemailer/index.d';
// mail.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendMail(data: nodemailer.SendMailOptions) {
        if (!data.to && !data.bcc && !data.cc) {
            throw new BadRequestException("Missing Email Destination");
        }
        if (!data.html && !data.text && !data.attachments?.length) {
            throw new BadRequestException("Missing Email Content");
        }
        const mailOptions = {
            from: '"My App" <' + process.env.EMAIL_USER + '>',
            ...data
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
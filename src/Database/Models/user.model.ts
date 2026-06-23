import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { PasswordService } from "src/common/Services/passwordService";

export enum GenderTypes {
    male = "male",
    female = "female",
}
export enum RoleTypes {
    admin = "admin",
    user = "user",
    superadmin = "superadmin",
}
@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class User {

    @Virtual({
        get(this: User) {
            return this.firstName + " " + this.lastName;
        },
        set(value: string) {
            const [firstName, lastName] = value.split(" ");
            this.firstName = firstName;
            this.lastName = lastName;
        }
    })
    username: string;

    @Prop({ required: true, minlength: 2, maxlength: 50, trim: true })
    firstName: string;

    @Prop({ required: true, minlength: 2, maxlength: 50, trim: true })
    lastName: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({})
    phone: string;

    @Prop({})
    address: string;

    @Prop({ type: Date })
    DOB: Date;

    @Prop({ type: Date })
    confirmEmail: Date;

    @Prop({ type: Date })
    changeCredentialTime: Date;

    @Prop()
    confirmEmailOtp: string;

    @Prop({ type: String, enum: GenderTypes, default: GenderTypes.male })
    gender: GenderTypes;

    @Prop({ type: String, enum: RoleTypes, default: RoleTypes.user })
    role: RoleTypes;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
]);

UserSchema.pre('save', async function (next: NextFunction) {
    if (this.isModified('password')) this.password = PasswordService.hash(this.password);
    if (this.isModified('confirmEmailOtp')) this.confirmEmailOtp = PasswordService.hash(this.confirmEmailOtp);
});

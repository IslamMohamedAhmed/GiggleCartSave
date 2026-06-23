import { Types } from "mongoose";
import { ICartItems } from "src/Database/Models/cart.model";

export interface ICart {
    user: Types.ObjectId;
    cartItems: ICartItems[];
    totalPrice: number;
    totalPriceAfterDiscount: number;
    createdAt?: Date;
    updatedAt?: Date;

}
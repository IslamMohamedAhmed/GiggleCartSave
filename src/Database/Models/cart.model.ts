import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ICart } from "src/Modules/cart/cart.interface";


@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Cart implements ICart {

    @Prop({ unique: true, required: true, ref: 'User', type: Types.ObjectId })
    user: Types.ObjectId;

    @Prop(
        raw([
            {
                product: { type: Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, default: 1 },
                price: { type: Number, required: true }
            },
        ])
    )
    cartItems: ICartItems[];


    @Prop({ required: true, type: Number })
    totalPrice: number;

    @Prop({ required: true, type: Number })
    totalPriceAfterDiscount: number;

    @Prop({ required: true, type: Number })
    discount: number;
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
export const CartModel = MongooseModule.forFeature([
    { name: Cart.name, schema: CartSchema }
]);

export interface ICartItems {
    product: Types.ObjectId;
    quantity: number;
    price: number;
}


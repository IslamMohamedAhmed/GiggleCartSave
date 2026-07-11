import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IOrder, IOrderProduct, OrderStatus, PaymentMethod } from 'src/Modules/order/order.interface';

@Schema({ timestamps: true, toObject: { virtuals: true }, virtuals: true, toJSON: { virtuals: true } })
export class Order implements IOrder {
    @Prop({ type: String, required: true })
    address: string;

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: String, required: false })
    intentId?: string;

    @Prop({ type: String, required: false })
    note?: string;

    @Prop({ type: String, required: false })
    rejectedReason?: string;  // Made optional to match interface

    @Prop({ type: Date, required: false })
    paidAt?: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy?: Types.ObjectId;

    @Prop({
        type: [{
            _id: { type: Types.ObjectId },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true },
            finalPrice: { type: Number, required: true }
        }], required: true
    })
    products: IOrderProduct[];

    @Prop({ type: String, enum: OrderStatus, required: true, default: OrderStatus.pending })
    status: OrderStatus;

    @Prop({ type: Number, required: true })
    subTotal: number;

    @Prop({ type: Number, required: false })
    refundAmount: number;

    @Prop({ type: Date, required: false })
    refundDate: Date;

    @Prop({ type: Number, required: false })
    discountAmount?: number;

    @Prop({ type: Number, required: true })
    finalPrice: number;

    @Prop({ type: String, enum: PaymentMethod, required: true })
    paymentMethod: PaymentMethod;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderModel = MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema }
]);




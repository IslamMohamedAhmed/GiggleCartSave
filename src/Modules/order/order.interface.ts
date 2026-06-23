import { Types } from 'mongoose';

export enum OrderStatus {
    pending = "pending",
    placed = "placed",
    onWay = "on_way",
    delivered = "delivered",
    cancelled = "cancelled"  // Fixed: added missing comma
}

export enum PaymentMethod {
    cash = 'cash',
    card = 'card',
}

export interface IOrderProduct {
    _id?: Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
    finalPrice: number;
}

export interface IOrder {
    _id?: Types.ObjectId;
    address: string;
    phone: string;
    note?: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    paidAt?: Date;
    rejectedReason?: string;
    products: IOrderProduct[];
    status: OrderStatus;
    subTotal: number;
    discountAmount?: number;
    finalPrice: number;
    paymentMethod: PaymentMethod;
    createdAt?: Date;
    updatedAt?: Date;
}
import { CartService } from './../cart/cart.service';
import { OrderRepositoryService } from './../../common/DP/orderRepositoryService';
import { ProductRepositoryService } from './../../common/DP/productRepositoryService';
import { CartRepositoryService } from './../../common/DP/cartRepositoryService';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from 'src/Database/Models/user.model';
import { CreateOrderDto } from './orderDtos/createOrder.dto';
import { OrderDocument } from 'src/Database/Models/order.model';
import { IOrderProduct, OrderStatus, PaymentMethod } from './order.interface';
import { Types } from 'mongoose';
import Stripe from 'node_modules/stripe/esm/stripe.esm.node';
import { PaymentService } from 'src/common/Services/paymentService';
import { Request, Response } from 'express';
import { realTimeGateway } from '../gateway/gateway';

@Injectable()
export class OrderService {
    constructor(private readonly productRepositoryService: ProductRepositoryService,
        private readonly orderRepositoryService: OrderRepositoryService,
        private readonly cartService: CartService,
        private readonly paymentService: PaymentService,
        private readonly realTimeGateway: realTimeGateway
    ) { }

    async createOrder(user: UserDocument, body: CreateOrderDto): Promise<{ message: string, order: OrderDocument }> {
        let cart = await this.cartService.getLoggedUserCart(user);
        if (!cart?.cartItems?.length) {
            throw new NotFoundException('cart is empty!!');
        }

        let subTotal: number = 0;
        let products: IOrderProduct[] = [];
        let productStockChanges: { productId: Types.ObjectId; stock: number }[] = [];
        for (const product of cart.cartItems) {
            const checkProduct = await this.productRepositoryService.findOne({
                filter: {
                    _id: product.product,
                    stock: { $gte: product.quantity },
                },
            });

            if (!checkProduct) {
                throw new BadRequestException(
                    `Invalid product or out of stock: ${product.product}`,
                );
            }

            const totalPrice = product.quantity * checkProduct.finalPrice;

            products.push({
                _id: checkProduct._id,
                name: checkProduct.name,
                quantity: product.quantity,
                unitPrice: checkProduct.finalPrice,
                finalPrice: totalPrice,
            });

            subTotal += totalPrice;

            let item = await this.productRepositoryService.updateById({
                id: checkProduct._id,
                data: { $inc: { stock: -product.quantity } }
            }
            );
            if (item) {
                productStockChanges.push({ productId: checkProduct._id, stock: item.stock });
                this.realTimeGateway.emitStockChanges({ productId: item._id, stock: item.stock });
            }
        }

        let finalPrice = Math.floor(subTotal * (1 - cart.discount / 100));

        const order = await this.orderRepositoryService.create({
            ...body,
            createdBy: user._id,
            products,
            subTotal,
            discountAmount: cart.discount,
            finalPrice
        });

        if (!order) {
            throw new BadRequestException('Invalid order!!')
        }
        await this.cartService.clearCart(user);

        return {
            message: 'Order created successfully',
            order
        };
    }

    async checkout(
        user: UserDocument,
        orderId: Types.ObjectId,
    ): Promise<{
        message: string;
        data: { session: Stripe.Response<Stripe.Checkout.Session> };
    }> {
        const order = await this.orderRepositoryService.findOne({
            filter: {
                _id: orderId,
                createdBy: user._id,
                status: OrderStatus.pending,
                paymentMethod: PaymentMethod.card,
            },
        });

        if (!order) {
            throw new BadRequestException('In-valid order');
        }

        let discounts: any = [];
        if (order.discountAmount) {
            let coupon = await this.paymentService.createCoupon({
                percent_off: order.discountAmount,
                duration: 'once'
            });
            discounts.push({ coupon: coupon.id });

        }

        const session = await this.paymentService.checkoutSession({
            customer_email: user.email,
            line_items: order.products.map((product) => ({
                quantity: product.quantity,
                price_data: {
                    product_data: {
                        name: product.name,
                    },
                    currency: 'egp',
                    unit_amount: product.unitPrice * 100,
                },
            })),
            metadata: {
                orderId: orderId as unknown as string,
            },
            discounts,
            cancel_url: `${process.env.CANCEL_URL}/order/${orderId}/cancel`,
            success_url: `${process.env.SUCCESS_URL}/order/${orderId}/success`,
        });
        const intent = await this.paymentService.createPaymentIntent(order.finalPrice);
        if (intent) {
            await this.orderRepositoryService.updateOne({
                filter: { _id: orderId },
                data: {
                    intentId: intent.id
                }
            });
        }
        return {
            message: 'Done',
            data: { session },
        };
    }

    async webhook(req: Request) {
        return this.paymentService.webhook(req);
    }

    async cancelOrder(
        user: UserDocument,
        orderId: Types.ObjectId,
    ): Promise<{ message: string }> {

        let refund = {};
        const order = await this.orderRepositoryService.findOne({
            filter: {
                _id: orderId,
                createdBy: user._id,
                status: { $in: [OrderStatus.pending, OrderStatus.placed] },
            },
        });

        if (!order) {
            throw new NotFoundException("Order is not found!!");
        }

        refund = { refundAmount: order.finalPrice, refundDate: Date.now() };

        // Refund if card payment
        if (order.paymentMethod === PaymentMethod.card && order.intentId) {
            await this.paymentService.refund(order.intentId);
        }

        // Restore stock
        for (const product of order.products) {
            await this.productRepositoryService.updateOne({
                filter: {
                    _id: product._id,
                },
                data: {
                    $inc: { stock: product.quantity },
                },
            });
        }

        // Update order status
        await this.orderRepositoryService.updateOne({
            filter: {
                _id: orderId,
            },
            data: {
                status: OrderStatus.cancelled,
                updatedBy: user._id,
                ...refund,
                canceledAt: Date.now(),
            },
        });

        return { message: 'Order canceled successfully' };
    }

}
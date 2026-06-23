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

@Injectable()
export class OrderService {
    constructor(private readonly productRepositoryService: ProductRepositoryService,
        private readonly orderRepositoryService: OrderRepositoryService,
        private readonly cartService: CartService,
        private readonly paymentService: PaymentService
    ) { }

    async createOrder(user: UserDocument, body: CreateOrderDto): Promise<{ message: string, order: OrderDocument }> {
        let cart = await this.cartService.getLoggedUserCart(user);
        if (!cart?.cartItems?.length) {
            throw new NotFoundException('cart is empty!!');
        }

        let subTotal: number = 0;
        let products: IOrderProduct[] = [];

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

            await this.productRepositoryService.updateOne({
                filter: { _id: checkProduct._id },
                data: { $inc: { stock: -product.quantity } },
            });
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

        let discounts = [{}];
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

        return {
            message: 'Done',
            data: { session },
        };
    }

}

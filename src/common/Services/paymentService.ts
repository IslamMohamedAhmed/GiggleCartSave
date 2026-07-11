import { BadRequestException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import Stripe from "node_modules/stripe/esm/stripe.esm.node";
import { OrderRepositoryService } from "../DP/orderRepositoryService";
import { OrderStatus } from "src/Modules/order/order.interface";

@Injectable()
export class PaymentService {
    private stripe: Stripe;
    constructor(private readonly orderRepositoryService: OrderRepositoryService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "")
    }

    async checkoutSession({
        customer_email,
        mode = paymentModes.payment,
        cancel_url = process.env.CANCEL_URL,
        success_url = process.env.SUCCESS_URL,
        metadata = {},
        line_items,
        discounts = [],
    }: {
        customer_email: string;
        mode?: paymentModes;
        cancel_url?: string;
        success_url?: string;
        metadata?: Record<string, string>;
        line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
        discounts?: Stripe.Checkout.SessionCreateParams.Discount[];
    }): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const session = await this.stripe.checkout.sessions.create({
            customer_email,
            mode,
            cancel_url,
            success_url,
            metadata,
            line_items,
            discounts,
        });
        return session;
    }

    async createCoupon(params: Stripe.CouponCreateParams): Promise<Stripe.Response<Stripe.Coupon>> {
        let coupon = await this.stripe.coupons.create(params);
        return coupon;
    }

    async webhook(request: Request) {

        console.log('webhook works!!');

        let event = request.body;
        // Only verify the event if you have an endpoint secret defined.
        // Otherwise use the basic event deserialized with JSON.parse
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers['stripe-signature'];
            if (signature) {
                event = this.stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    endpointSecret
                );
                if (event.type != 'checkout.session.completed') {
                    throw new BadRequestException('Fail to pay');
                }

                await this.orderRepositoryService.updateOne({
                    filter: {
                        _id: event.data.object['metadata'].orderId,
                        status: OrderStatus.pending
                    },
                    data: {
                        status: OrderStatus.placed,
                        paidAt: Date.now(),
                    }
                });
            }
        }

    }

    async createPaymentIntent(amount: number, currency: string = 'egp') {
        const paymentMethod = await this.createPaymentMethod();
        const intent = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
            payment_method: paymentMethod.id,
        });
        return intent;
    }

    async createPaymentMethod(token: string = 'tok_visa') {
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                token,
            },
        });
        return paymentMethod;
    }

    async retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
            return paymentIntent;
        } catch (error) {
            throw new BadRequestException('Invalid payment intent');
        }
    }

    async confirmPaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
        const intent = await this.retrievePaymentIntent(id);
        if (!intent) {
            throw new BadRequestException('Invalid intent');
        }

        const paymentIntent = await this.stripe.paymentIntents.confirm(intent.id, {
            payment_method: 'pm_card_visa'
        });

        if (paymentIntent.status !== 'succeeded') {
            throw new BadRequestException('Fail to confirm intent');
        }

        return paymentIntent;
    }

    async refund(id: string): Promise<Stripe.Response<Stripe.Refund>> {
        const refund = await this.stripe.refunds.create({
            payment_intent: id,
        });
        return refund;
    }



}

export enum paymentModes {
    payment = "payment",
    subscription = "subscription",
    setup = "setup"
}
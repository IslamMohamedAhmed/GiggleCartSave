import { Injectable } from "@nestjs/common";
import Stripe from "node_modules/stripe/esm/stripe.esm.node";

@Injectable()
export class PaymentService {
    private stripe: Stripe;
    constructor() {
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
    
}

export enum paymentModes {
    payment = "payment",
    subscription = "subscription",
    setup = "setup"
}
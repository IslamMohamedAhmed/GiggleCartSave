import { CartRepositoryService } from 'src/common/DP/cartRepositoryService';
import { ProductRepositoryService } from './../../common/DP/productRepositoryService';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from 'src/Database/Models/user.model';
import { CartDocument } from 'src/Database/Models/cart.model';
import { removeFromCartDto } from './CartDtos/removeFromCart.dto';
import { addToCartDto, updateProductQuantityDto } from './CartDtos/addToCart.dto';
import { applyCouponDto } from './CartDtos/applyCoupon.dto';
import { CouponRepositoryService } from 'src/common/DP/couponRepositoryService';

@Injectable()
export class CartService {

    constructor(private readonly productRepositoryService: ProductRepositoryService,
        private readonly cartRepositoryService: CartRepositoryService,
        private readonly couponRepository: CouponRepositoryService
    ) { }

    async addToCart(user: UserDocument, body: addToCartDto): Promise<{ message: string, cart: CartDocument }> {
        let cartExist = await this.cartRepositoryService.findOne({ filter: { user: user._id } });
        let product = await this.productRepositoryService.findOne({ filter: { _id: body.product } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        if (!cartExist) {
            if (body.quantity > product['stock']) {
                throw new BadRequestException('Invalid quantity!!');
            }
            else {
                let price = product['finalPrice'];
                let cartItem = { product: body.product, quantity: body.quantity || 1, price };
                let totalPrice = cartItem.quantity * cartItem.price;
                let discount = 0;

                console.log(totalPrice);

                let totalPriceAfterDiscount = totalPrice * (1 - (discount / 100));
                let cart = await this.cartRepositoryService
                    .create({
                        user: user._id, cartItems: [cartItem],
                        totalPrice, totalPriceAfterDiscount, discount
                    });
                return { message: 'success, product was added successfully', cart };
            }
        }
        else {
            let productExist = cartExist.cartItems.find(item => item.product.equals(product._id));
            if (productExist) {
                if (productExist.quantity + body.quantity > product['stock']) {
                    throw new BadRequestException('Invalid quantity!!');
                }
                else {
                    productExist.quantity += body.quantity;
                }
            }
            else {
                if (body.quantity > product['stock']) {
                    throw new BadRequestException('Invalid quantity!!');
                }
                else {
                    let cartItem = { product: body.product, quantity: body.quantity || 1, price: product['finalPrice'] };
                    cartExist.cartItems.push(cartItem);
                }
            }
            cartExist.totalPrice = cartExist.cartItems.reduce((acc, item) => {
                return acc + (item.quantity * item.price);
            }, 0);
            console.log(cartExist.totalPrice);

            if (cartExist.discount >= 0) {
                console.log("hello");

                cartExist.totalPriceAfterDiscount = cartExist.totalPrice * (1 - (cartExist.discount / 100));
            }
            await cartExist.save();
            return { message: 'success, cart was updated successfully', cart: cartExist };

        }
    }

    async removeFromCart(user: UserDocument, param: removeFromCartDto): Promise<{ message: string }> {
        let cart = await this.cartRepositoryService.findOne({ filter: { user: user._id } });
        let { productId } = param;
        if (!cart) {
            throw new NotFoundException('Your Cart is empty!!');
        }
        let productIndex = cart.cartItems.findIndex(item => item.product.equals(productId));
        if (productIndex === -1) {
            throw new NotFoundException('Product not found in cart');
        }
        cart.cartItems.splice(productIndex, 1);
        cart.totalPrice = cart.cartItems.reduce((acc, item) => {
            return acc + (item.quantity * item.price);
        }, 0);
        if (cart.discount) {
            cart.totalPriceAfterDiscount = cart.totalPrice * (1 - cart.discount / 100);
        }
        await cart.save();
        return { message: 'success, product was removed successfully' };
    }

    async updateProductQuantity(user: UserDocument, body: updateProductQuantityDto): Promise<{ message: string, cart: CartDocument }> {
        let cart = await this.cartRepositoryService.findOne({ filter: { user: user._id } });
        if (cart) {
            let productExist = cart.cartItems.find(item => item.product.equals(body.product));
            if (productExist) {
                let product = await this.productRepositoryService.findOne({ filter: { _id: productExist.product } });
                if (!product) {
                    throw new NotFoundException('Product not found');
                }
                if (body.quantity > product['stock']) {
                    throw new BadRequestException('Invalid quantity!!');
                }
                else {
                    productExist.quantity = body.quantity;
                    cart.totalPrice = cart.cartItems.reduce((acc, item) => {
                        return acc + (item.quantity * item.price);
                    }, 0);
                    if (cart.discount >= 0) {
                        cart.totalPriceAfterDiscount = cart.totalPrice * (1 - cart.discount / 100);
                    }
                    await cart.save();
                    return { message: 'success, product quantity was updated successfully', cart };
                }
            }
            else {
                throw new NotFoundException('Product not found in cart');
            }
        }
        else {
            throw new NotFoundException('Your Cart is empty!!');
        }
    }

    async getLoggedUserCart(user: UserDocument): Promise<CartDocument> {
        let cart = await this.cartRepositoryService.findOne({ filter: { user: user._id } });
        if (!cart) {
            throw new NotFoundException('Your Cart is empty!!');
        }
        return cart;
    }

    async clearCart(user: UserDocument): Promise<{ message: string }> {
        let cart = await this.cartRepositoryService.findOne({ filter: { user: user._id } });
        if (!cart) {
            throw new NotFoundException('Your Cart is empty!!');
        }
        await this.cartRepositoryService.deleteOne({ user: user._id });
        return { message: 'success, cart was cleared successfully' };
    }

    async applyCoupon(user: UserDocument, body: applyCouponDto): Promise<{ message: string, cart: CartDocument }> {
        let coupon = await this.couponRepository.findOne({ filter: { code: body.code, expiresAt: { $gte: Date.now() } } });
        if (coupon) {
            let cart = await this.cartRepositoryService.findOne({ filter: { user: user._id } });
            if (cart) {
                cart.discount = coupon.discount;
                cart.totalPriceAfterDiscount = cart.totalPrice * (1 - cart.discount / 100);
                await cart.save();
                return { message: 'success, discount was applied successfully!', cart }
            }
            else {
                throw new NotFoundException('cart is not found!!');
            }
        }
        else {

            throw new NotFoundException('coupon is not found!!');
        }

    }


}
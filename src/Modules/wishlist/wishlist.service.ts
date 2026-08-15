import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepositoryService } from 'src/common/DP/cartRepositoryService';
import { ProductRepositoryService } from 'src/common/DP/productRepositoryService';
import { UserDocument } from 'src/Database/Models/user.model';
import { wishlistOperationsDto } from './wishlistDto/wishlistOperations.dto';
import { UserRepositoryService } from 'src/common/DP/userRepositoryService';
import { Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { CartDocument, ICartItems } from 'src/Database/Models/cart.model';

@Injectable()
export class WishlistService {
    constructor(@Inject(forwardRef(() => CartService))
  private readonly cartService: CartService,
        private readonly productRepositoryService: ProductRepositoryService,
        private readonly userRepositoryService: UserRepositoryService) { }


    async addToWishlist(user: UserDocument, body: wishlistOperationsDto): Promise<{ message: string, wishlist: Types.ObjectId[] }> {
        if (user.wishlist.length == 10) throw new NotFoundException('wishlist is full');
        let product = await this.productRepositoryService.findById({ id: body.productId });
        if (!product) throw new NotFoundException('product not found');
        if (user.wishlist.includes(product._id)) throw new NotFoundException('product is already in wishlist');

        user.wishlist.push(product._id);
        await user.save();

        return { message: 'product was added successfully to wishlist', wishlist: user.wishlist };
    }

    async removeFromWishlist(user: UserDocument, body: wishlistOperationsDto): Promise<{ message: string, wishlist: Types.ObjectId[] }> {
        let product = await this.productRepositoryService.findById({ id: body.productId });
        if (!product) throw new NotFoundException('product not found');
        if (!user.wishlist.includes(product._id)) throw new NotFoundException('product is not in wishlist');
        user.wishlist = user.wishlist.filter((id) => !id.equals(product._id));
        await user.save();
        return { message: 'product was removed successfully from wishlist', wishlist: user.wishlist };
    }

    async getWishlist(user: UserDocument): Promise<{ message: string, wishlist: Types.ObjectId[] }> {
        return { message: `user ${user.username}'s wishlist`, wishlist: user.wishlist };
    }

    async moveToCart(user: UserDocument, body: wishlistOperationsDto): Promise<{
        message: string, wishlist: Types.ObjectId[],
        cart: ICartItems[] | [] | CartDocument
    }> {
        let product = await this.productRepositoryService.findById({ id: body.productId });
        if (!product) throw new NotFoundException('product not found');
        if (!user.wishlist.includes(product._id)) throw new NotFoundException('product is not in wishlist');
        user.wishlist = user.wishlist.filter((id) => !id.equals(product._id));
        await user.save();
        await this.cartService.addToCart(user, { product: product._id, quantity: 1 });
        const cart = await this.cartService.getLoggedUserCart(user);
        return { message: 'product was moved successfully from wishlist to cart', wishlist: user.wishlist, cart: cart.cartItems };
    }

    async clearWishlist(user: UserDocument): Promise<{ message: string, wishlist: Types.ObjectId[] }> {
        if (user.wishlist.length == 0) throw new NotFoundException('wishlist is already empty');
        user.wishlist = [];
        await user.save();
        return { message: 'wishlist was cleared successfully', wishlist: user.wishlist };
    }
}
import { Body, Controller, Delete, Get, Param, Patch, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { addToCartDto, updateProductQuantityDto } from './CartDtos/addToCart.dto';
import { CartDocument } from 'src/Database/Models/cart.model';
import { removeFromCartDto } from './CartDtos/removeFromCart.dto';
import { applyCouponDto } from './CartDtos/applyCoupon.dto';
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
@Auth([RoleTypes.admin, RoleTypes.superadmin, RoleTypes.user])
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }
  @Patch()
  async addToCart(@User() user: UserDocument, @Body() body: addToCartDto): Promise<{ message: string, cart: CartDocument }> {
    return this.cartService.addToCart(user, body);
  }

  @Delete()
  async clearUserCart(@User() user: UserDocument): Promise<{ message: string }> {
    return this.cartService.clearCart(user);
  }


  @Delete(':productId')
  async removeFromCart(@User() user: UserDocument, @Param() param: removeFromCartDto): Promise<{ message: string }> {
    return this.cartService.removeFromCart(user, param);
  }

  @Get()
  async getLoggedUserCart(@User() user: UserDocument): Promise<CartDocument> {
    return this.cartService.getLoggedUserCart(user);
  }

  @Put()
  async updateProductQuantity(@User() user: UserDocument, @Body() body: updateProductQuantityDto): Promise<{ message: string, cart: CartDocument }> {
    return this.cartService.updateProductQuantity(user, body);
  }


  @Patch('applyCoupon')
  async applyCoupon(@User() user: UserDocument, @Body() body: applyCouponDto): Promise<{ message: string, cart: CartDocument }> {
    return this.cartService.applyCoupon(user, body);
  }





}

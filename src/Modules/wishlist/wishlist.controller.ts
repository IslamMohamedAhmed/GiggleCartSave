import { Body, Controller, Delete, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { wishlistOperationsDto } from './wishlistDto/wishlistOperations.dto';
import { User } from 'src/common/Custom-Decorators/user.decorator';
import { RoleTypes, type UserDocument } from 'src/Database/Models/user.model';
import { Auth } from 'src/common/Custom-Decorators/auth.decorator';

@Controller('wishlist')
@Auth([RoleTypes.admin, RoleTypes.user, RoleTypes.superadmin])
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async addToWishlist(@User() user: UserDocument, @Body() body: wishlistOperationsDto) {
    return this.wishlistService.addToWishlist(user, body);
  }

  @Get()
  async getWishlist(@User() user: UserDocument) {
    return this.wishlistService.getWishlist(user);
  }

  @Delete()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async removeFromWishlist(@User() user: UserDocument, @Body() body: wishlistOperationsDto) {
    return this.wishlistService.removeFromWishlist(user, body);
  }

  @Delete('clear')
  async clearWishlist(@User() user: UserDocument) {
    return this.wishlistService.clearWishlist(user);
  }



  @Post('move-to-cart')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, stopAtFirstError: true }))
  async moveToCart(@User() user: UserDocument, @Body() body: wishlistOperationsDto) {
    return this.wishlistService.moveToCart(user, body);
  }

}

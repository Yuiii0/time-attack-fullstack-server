import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from 'src/decorators/user.decorator';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  getMyLikedPosts(@DUser() user: User) {
    return this.likesService.getMyLikedPosts(user);
  }
}

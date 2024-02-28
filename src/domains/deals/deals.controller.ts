import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from './../../decorators/user.decorator';
import { PostRegisterDto, PostUpdateDto } from './deals.dto';
import { DealsService } from './deals.service';
import { LikesService } from './likes/likes.service';

@Controller('deals')
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly likesService: LikesService,
  ) {}

  @Post('/create')
  registerPost(@DUser() user: User, @Body() dto: PostRegisterDto) {
    console.log(user);
    return this.dealsService.registerPost({ ...dto, authorId: user.id });
  }

  @Get()
  getPosts() {
    return this.dealsService.getPosts();
  }

  @Get(':dealId')
  getPost(@Param('dealId', ParseIntPipe) dealId: number) {
    return this.dealsService.getPost(dealId);
  }

  @Put(':dealId/edit')
  updatePost(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
    @Body() dto: PostUpdateDto,
  ) {
    return this.dealsService.updatePost(user, dealId, dto);
  }

  @Delete(':dealId')
  deletePost(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
  ) {
    return this.dealsService.deletePost(user, dealId);
  }

  @Post(':dealId/likes')
  likePost(@DUser() user: User, @Param('dealId', ParseIntPipe) dealId: number) {
    return this.likesService.toggleLikeOnDeal(user, dealId);
  }
}

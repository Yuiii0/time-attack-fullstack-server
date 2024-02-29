import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { DUser } from './../../decorators/user.decorator';
import { PostUpdateDto } from './deals.dto';
import { DealsService } from './deals.service';
import { LikesService } from './likes/likes.service';

@Controller('deals')
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly likesService: LikesService,
  ) {}

  @Post('/create')
  // @Private('user')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @DUser() user: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: any,
  ) {
    // Multer는 파일을 다루는 라이브러리

    const data = {
      imgSrc: image,
      title: dto.title,
      content: dto.content,
      location: dto.location,
      price: Number(dto.price),
    };

    const result = this.dealsService.createProduct(user.id, data); //서비스에 보내줌

    return result;
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
  // @Private('user')
  updatePost(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
    @Body() dto: PostUpdateDto,
  ) {
    return this.dealsService.updatePost(user, dealId, dto);
  }

  @Delete(':dealId')
  // @Private('user')
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

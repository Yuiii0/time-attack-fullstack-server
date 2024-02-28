import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { PostRegisterDto, PostUpdateDto } from './deals.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prismaService: PrismaService) {}
  async registerPost(dto: PostRegisterDto) {
    const { content, title, location, price, authorId, imgSrc } = dto;

    const post = await this.prismaService.post.create({
      data: { content, title, location, price, authorId, imgSrc },

      select: {
        authorId: true,
        author: { select: { email: true } },
        title: true,
        content: true,
        location: true,
        price: true,
        imgSrc: true,
        createdAt: true,
        likedPost: true,
      },
    });
    return post;
  }

  async getPosts() {
    const posts = this.prismaService.post.findMany({
      include: { author: { select: { email: true } } },
    });
    return posts;
  }

  async getPost(dealId: number) {
    const post = this.prismaService.post.findUnique({
      where: { id: dealId },
      include: { author: { select: { email: true } } },
    });
    return post;
  }

  async getMyPost(user: Pick<User, 'id' | 'email'>) {
    const posts = this.prismaService.post.findMany({
      where: { authorId: user.id },
    });
    return posts;
  }

  async updatePost(
    user: Pick<User, 'id' | 'email'>,
    dealId: Post['id'],
    dto: PostUpdateDto,
  ) {
    const { content, title, location, price } = dto;
    const authorId = user.id;
    const post = await this.prismaService.post.update({
      where: { id: dealId, authorId: user.id },
      data: { content, title, location, price, authorId },
    });
    return post;
  }

  async deletePost(user: Pick<User, 'id' | 'email'>, dealId: Post['id']) {
    const post = await this.prismaService.post.delete({
      where: { id: dealId, authorId: user.id },
    });
    if (!post) throw new ForbiddenException('');
    return dealId;
  }
}

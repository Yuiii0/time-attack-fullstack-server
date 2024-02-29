import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { PostUpdateDto } from './deals.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prismaService: PrismaService) {}
  async createProduct(authorId: number, dto: any) {
    const { title, content, imgSrc, price, location } = dto;

    const basePath = join(__dirname, '../../../public/images');
    const fileName = nanoid();
    const fileExtension = imgSrc.originalname.split('.').pop();
    const path = join(basePath, `${fileName}.${fileExtension}`);
    console.log(path);

    await writeFile(path, imgSrc.buffer);

    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        imgSrc: `/images/${fileName}.${fileExtension}`,
        price,
        authorId,
        location,
      },
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

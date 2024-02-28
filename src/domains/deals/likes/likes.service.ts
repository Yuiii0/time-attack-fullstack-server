import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}
  async toggleLikeOnDeal(user: Pick<User, 'id' | 'email'>, dealId: Post['id']) {
    const isLiked = await this.prismaService.likedPost.findUnique({
      where: { userId_postId: { userId: user.id, postId: dealId } },
    });

    if (isLiked) {
      await this.prismaService.likedPost.delete({
        where: { userId_postId: { userId: user.id, postId: dealId } },
      });
      return false;
    } else {
      await this.prismaService.likedPost.create({
        data: { userId: user.id, postId: dealId },
      });
      return true;
    }
  }
  async getMyLikedPosts(user: Pick<User, 'id' | 'email'>) {
    const posts = await this.prismaService.likedPost.findMany({
      where: { userId: user.id },
      include: { post: true },
    });
    return posts;
  }
}

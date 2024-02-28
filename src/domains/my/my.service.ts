import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class MyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMyPost(user: Pick<User, 'id' | 'email'>) {
    const posts = this.prismaService.post.findMany({
      where: { authorId: user.id },
    });
    return posts;
  }
}

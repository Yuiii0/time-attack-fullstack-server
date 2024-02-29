import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { verify } from 'jsonwebtoken';
import { ParsedQs } from 'qs';
import { PrismaService } from 'src/db/prisma/prisma.service';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) throw new BadRequestException('No JWT_SECRET_KEY');

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async use(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: (error?: any) => void,
  ) {
    const accessToken = req.headers.authorization?.split('Bearer ')[1];

    if (!accessToken) {
      return next();
    }

    let id: number;

    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
      const { sub } = verify(accessToken, secret);
      id = Number(sub);
    } catch (e) {
      throw new UnauthorizedException('Invalid accessToken');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new BadRequestException('Deleted user');
    }

    req.user = user;

    next();
  }
}

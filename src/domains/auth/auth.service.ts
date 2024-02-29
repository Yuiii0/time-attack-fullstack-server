import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { isEmail } from 'validator';
import { UserLogInDto, UserSignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: UserSignUpDto) {
    const { email, password } = dto;

    if (!email.trim()) throw new BadRequestException('No email');
    if (!isEmail(email)) throw new BadRequestException('Invalid exmail');
    if (!password.trim()) throw new BadRequestException('No password');
    if (password.length < 8)
      throw new BadRequestException('Too short password');

    const encryptedPassword = await hash(password, 12);

    const user = await this.prismaService.user.create({
      data: {
        email,
        encryptedPassword,
      },
    });
    const accessToken = this.generateAccessToken(user);
    return accessToken;
  }
  async logIn(dto: UserLogInDto) {
    const { email, password } = dto;

    if (!email.trim()) throw new BadRequestException('No email');
    if (!isEmail(email)) throw new BadRequestException('Invalid exmail');
    if (!password.trim()) throw new BadRequestException('No password');
    if (password.length < 8)
      throw new BadRequestException('Too short password');

    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('No user');

    try {
      await compare(password, user.encryptedPassword);
    } catch (e) {
      throw new BadRequestException('Invalid password');
    }

    const accessToken = this.generateAccessToken(user);

    return accessToken;
  }
  async refreshToken(user: User) {
    const id = user.id;
    const email = user.email;
    const RefreshedAccessToken = this.generateAccessToken(user);

    return RefreshedAccessToken;
  }
  generateAccessToken(user: Pick<User, 'id' | 'email'>) {
    const { id, email } = user;
    const subject = String(id);

    const secretKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
    const accessToken = sign({ email, accountType: 'user' }, secretKey, {
      subject,
      expiresIn: '20m',
    });

    return accessToken;
  }
}

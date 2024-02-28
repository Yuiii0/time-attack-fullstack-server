import { Prisma } from '@prisma/client';

export type PostRegisterDto = {
  title: string;
  content: string;
  imgSrc: string;
  price: number;
  location: string;
  authorId: number;
};
export type PostUpdateDto = Prisma.PostCreateWithoutAuthorInput;

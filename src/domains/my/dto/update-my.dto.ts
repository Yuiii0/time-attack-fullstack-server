import { PartialType } from '@nestjs/mapped-types';
import { CreateMyDto } from './create-my.dto';

export class UpdateMyDto extends PartialType(CreateMyDto) {}

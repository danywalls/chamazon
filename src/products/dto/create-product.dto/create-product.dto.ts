import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly price: string;
  @IsString({ each: true })
  readonly categories: string[];
}

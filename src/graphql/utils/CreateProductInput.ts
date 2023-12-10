import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { ProductStatus } from '../models/Product'

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field((type) => Float)
  @IsNumber()
  @IsNotEmpty()
  @Max(999999.99)
  price: number;

  @Field((type) => ProductStatus, { defaultValue: ProductStatus.ACTIVE })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @Field((type) => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  imageIds?: number[];
}
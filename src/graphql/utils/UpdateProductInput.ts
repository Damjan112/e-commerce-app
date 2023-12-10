import { InputType, Float, Field, ID } from "@nestjs/graphql";
import { IsString, IsOptional, IsNumber, Max, IsEnum, IsArray, ArrayNotEmpty } from "class-validator";
import { ProductStatus } from "../models/Product";

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Max(999999.99)
  price?: number;

  @Field((type) => ProductStatus, { nullable: true })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @Field((type) => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  imageIds?: number[];
}
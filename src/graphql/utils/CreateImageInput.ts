import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsUrl, Max } from 'class-validator';


@InputType()
export class CreateImageInput {
  @Field()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @Field((type) => Int, { defaultValue: 1000 })
  @IsNumber()
  @Max(9999)
  priority: number;

  @Field((type) => Int, {nullable: true})
  @IsOptional()
  productId?: number;
}
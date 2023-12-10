import { Field, InputType, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsUrl, Max } from 'class-validator';

@InputType()
export class UpdateImageInput {
    @Field({ nullable: true })
    @IsUrl()
    @IsNotEmpty()
    url?: string;

    @Field((type) => Int, { defaultValue: 1000, nullable: true })
    @IsNumber()
    @Max(9999)
    priority?: number;

    @Field((type) => ID, { nullable: true })
    @IsOptional()
    productId?: number;
}
import { Field, ObjectType, registerEnumType, Float, Int } from "@nestjs/graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { Image } from "./Image";

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}
registerEnumType(ProductStatus, {
    name: 'ProductStatus',
});

@ObjectType()
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column({ type: 'varchar', length: 255 })
    @Field()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Field((type) => Float)
    price: number;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
    @Field((type) => ProductStatus)
    status: ProductStatus;

    @OneToMany(() => Image, image => image.product, { nullable: true, cascade: true })
    @Field((type) => [Image], { nullable: true })
    images?: Image[] | null;
}
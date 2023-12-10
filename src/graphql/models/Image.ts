import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
@ObjectType()
export class Image {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column({ type: 'varchar', length: 255 })
    @Field()
    url: string;

    @Column({ type: 'int', default: 1000 })
    @Field((type) => Int, { defaultValue: 1000 })
    priority: number;

    @ManyToOne(() => Product, product => product.images, {nullable:true})
    @Field((type) => Product, {nullable:true})
    product?: Product;
}
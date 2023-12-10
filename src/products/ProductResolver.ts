import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { ProductService } from './ProductService';
import { Product } from '../graphql/models/Product';

import { Image } from '../graphql/models/Image';
import { CreateProductInput } from 'src/graphql/utils/CreateProductInput';
import { UpdateProductInput } from 'src/graphql/utils/UpdateProductInput';

@Resolver((of) => Product)
export class ProductsResolver {
    constructor(
        private readonly productsService: ProductService,
    ) { }

    @Query((returns) => [Product])
    async products(): Promise<Product[]> {
        return this.productsService.getAllProducts();
    }

    @Query((returns) => Product, { nullable: true })
    async product(@Args('id', { type: () => ID }) id: number): Promise<Product> {
        return this.productsService.getProductById(id);
    }

    @Mutation((returns) => Product)
    async createProduct(
        @Args('input') input: CreateProductInput,
    ): Promise<Product> {
        return this.productsService.createProduct(input);
    }

    @Mutation((returns) => Product)
    async updateProduct(
        @Args('id', { type: () => ID }) id: number,
        @Args('input') input: UpdateProductInput,
    ): Promise<Product> {
        return this.productsService.updateProduct(id, input);
    }

    @Mutation((returns) => Product)
    async deleteProduct(
        @Args('id', { type: () => ID }) id: number,
    ): Promise<Product> {
        return this.productsService.deleteProduct(id);
    }

}

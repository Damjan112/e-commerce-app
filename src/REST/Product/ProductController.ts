import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductService } from 'src/products/ProductService';
import { CreateProductInput } from 'src/graphql/utils/CreateProductInput';
import { UpdateProductInput } from 'src/graphql/utils/UpdateProductInput';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductInput) {
    return this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductInput) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../graphql/models/Product';
import { CreateProductInput } from '../graphql/utils/CreateProductInput';
import { UpdateProductInput } from '../graphql/utils/UpdateProductInput';
import { Image } from '../graphql/models/Image';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) { }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['images'] });
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const { imageIds, ...productData } = input;
  
    const newProduct = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(newProduct);
  
    if (imageIds && imageIds.length > 0) {
      const images = await this.imageRepository.findBy({ id: In(imageIds) });
  
      if (images.length > 0) {
        images.forEach((image) => {
          image.product = savedProduct;
        });
  
        await this.imageRepository.save(images);
      }
       else {
        console.error(`Images with the provided IDs not found`);
      }
    }
  
    return savedProduct;
  }

  async updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    await this.getProductById(id);
  
    const { imageIds, ...updatedProductData } = input;

    const currentProduct = await this.productRepository.findOne({ where: { id }, relations: ['images'] });
  
    if (currentProduct.images && currentProduct.images.length > 0) {
      currentProduct.images = [];
      await this.productRepository.save(currentProduct);
    }
  
    await this.productRepository.update(id, updatedProductData);
  
    const updatedProduct = await this.productRepository.findOne({ where: { id }, relations: ['images'] });
  
    if (imageIds && imageIds.length > 0) {
      const images = await this.imageRepository.findBy({ id: In(imageIds) });
  
      if (images.length > 0) {
        images.forEach((image) => {
          updatedProduct.images.push(image);
        });
  
        await this.imageRepository.save(images);
        await this.productRepository.save(updatedProduct);
        
      } else {
        console.error(`Images with the provided IDs not found`);
      }
    }
  
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<Product> {
    const product = await this.getProductById(id);

    await this.productRepository.remove(product);
    return product;
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "../graphql/models/Image"
import { CreateImageInput } from "../graphql/utils/CreateImageInput";
import { Repository } from "typeorm";
import { UpdateImageInput } from "../graphql/utils/UpdateImageInput"
import { Product } from "../graphql/models/Product";

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async getAllImages(): Promise<Image[]> {
        return this.imageRepository.find({ relations: ['product'] });
    }

    async getImageById(id: number): Promise<Image> {
        const image = await this.imageRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!image) {
            throw new NotFoundException(`Image with ID ${id} not found`);
        }

        return image;
    }

    async createImage(input: CreateImageInput): Promise<Image> {
        const { productId, ...imageData } = input;
        const image = this.imageRepository.create(imageData);

        if (productId) {
            const product = await this.productRepository.findOne({
                where: {
                    id: productId
                }
            });

            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }

            image.product = product;
        }

        return this.imageRepository.save(image);
    }

    async updateImage(id: number, input: UpdateImageInput): Promise<Image> {
        const existingImage = await this.getImageById(id);

        if (existingImage) {
            const { productId, ...imageData } = input;
            await this.imageRepository.update(id, { ...imageData, product: null });

            if (productId) {
                const image = await this.imageRepository.findOne({ where: { id } });

                if (!image) {
                    throw new NotFoundException(`Image with ID ${id} not found`);
                }

                const product = await this.productRepository.findOne({
                    where: {
                        id: productId
                    }
                });

                if (!product) {
                    throw new NotFoundException(`Product with ID ${productId} not found`);
                }

                image.product = product;
                await this.imageRepository.save(image);
            }

            return this.getImageById(id);
        }
        else
        {
            throw new NotFoundException(`Image with ID ${id} not found`);
        }
    }

    async deleteImage(id: number): Promise<Image> {
        const image = await this.getImageById(id);

        await this.imageRepository.remove(image);
        return image;
    }
}
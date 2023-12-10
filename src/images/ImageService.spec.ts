import { Repository } from "typeorm";
import { ImageService } from "./ImageService";
import { NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../graphql/models/Product";
import { Image } from "../graphql/models/Image";


describe('ImageService', () => {
    let imageService: ImageService;
    let imageRepository: Repository<Image>;
    let productRepository: Repository<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: getRepositoryToken(Image),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Product),
                    useClass: Repository,
                },
            ],
        }).compile();

        imageService = module.get<ImageService>(ImageService);
        imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
        productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(imageService).toBeDefined();
    });

    describe('getAllImages', () => {
        it('should return an array of images', async () => {
            const mockImages = [{ id: 1, url: 'image1.jpg' }];
            jest.spyOn(imageRepository, 'find').mockResolvedValueOnce(mockImages as any);

            const result = await imageService.getAllImages();
            expect(result).toEqual(mockImages);
        });
    });

    describe('getImageById', () => {
        it('should return an image by ID', async () => {
            const mockImage = { id: 1, url: 'image1.jpg' };
            jest.spyOn(imageRepository, 'findOne').mockResolvedValueOnce(mockImage as any);

            const result = await imageService.getImageById(1);
            expect(result).toEqual(mockImage);
        });

        it('should throw NotFoundException if image not found', async () => {
            jest.spyOn(imageRepository, 'findOne').mockResolvedValueOnce(null);

            await expect(imageService.getImageById(1)).rejects.toThrowError(NotFoundException);
        });
    });

    //tests for createImage, updateImage, deleteImage.

    describe('createImage', () => {
        it('should create a new image with associated product', async () => {
            const mockImageData = { url: 'new-image.jpg', priority: 1000, productId: 1 };
            const mockImage = { id: 1, ...mockImageData };
    
            jest.spyOn(imageRepository, 'create').mockReturnValueOnce(mockImage as any);
            jest.spyOn(imageRepository, 'save').mockResolvedValueOnce(mockImage as any);
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as any);
    
            const result = await imageService.createImage(mockImageData);
            expect(result).toEqual(mockImage);
        });
    
        it('should create a new image without associated product if productId is not provided', async () => {
            const mockImageData = { url: 'new-image.jpg', priority: 1000 };
            const mockImage = { id: 1, ...mockImageData };
    
            jest.spyOn(imageRepository, 'create').mockReturnValueOnce(mockImage as any);
            jest.spyOn(imageRepository, 'save').mockResolvedValueOnce(mockImage as any);
    
            const result = await imageService.createImage(mockImageData);
            expect(result).toEqual(mockImage);
        });
    });

    describe('updateImage', () => {
        it('should update an image with associated product', async () => {
            const mockUpdatedImageData = { url: 'updated-image.jpg', priority: 1500, productId: 2 };
            const mockImage = { id: 1, url: 'image1.jpg', priority: 1000, product: { id: 1 } } as any;
    
            jest.spyOn(imageRepository, 'findOne').mockResolvedValueOnce(mockImage);
            jest.spyOn(imageRepository, 'update').mockResolvedValueOnce(null);
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce({ id: 2 } as any);
            jest.spyOn(imageRepository, 'save').mockResolvedValueOnce({ ...mockImage, ...mockUpdatedImageData } as any);
    
            const result = await imageService.updateImage(1, mockUpdatedImageData);
            expect(result).toEqual({ ...mockImage, ...mockUpdatedImageData });
        });
    
        it('should update an image without associated product if productId is not provided', async () => {
            const mockUpdatedImageData = { url: 'updated-image.jpg', priority: 1500 };
            const mockImage = { id: 1, url: 'image1.jpg', priority: 1000, product: { id: 1 } } as any;
    
            jest.spyOn(imageRepository, 'findOne').mockResolvedValueOnce(mockImage);
            jest.spyOn(imageRepository, 'update').mockResolvedValueOnce(null);
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce({ id: 2 } as any);
            jest.spyOn(imageRepository, 'save').mockResolvedValueOnce({ ...mockImage, ...mockUpdatedImageData, product: null } as any);
    
            const result = await imageService.updateImage(1, mockUpdatedImageData);
            expect(result).toEqual({ ...mockImage, ...mockUpdatedImageData, product: null });
        });
    });

    describe('deleteImage', () => {
        it('should delete an image', async () => {
            const mockImage = { id: 1, url: 'image1.jpg' };
            jest.spyOn(imageRepository, 'findOne').mockResolvedValueOnce(mockImage as any);
            jest.spyOn(imageRepository, 'remove').mockResolvedValueOnce(null);

            const result = await imageService.deleteImage(1);
            expect(result).toEqual(mockImage);
        });

        it('should throw NotFoundException if image not found', async () => {
            jest.spyOn(imageRepository, 'findOne').mockResolvedValueOnce(null);

            await expect(imageService.deleteImage(1)).rejects.toThrowError(NotFoundException);
        });
    });
});
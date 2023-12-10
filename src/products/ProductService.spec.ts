import { NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product, ProductStatus } from "../graphql/models/Product";
import { Image } from "../graphql/models/Image";
import { Repository } from "typeorm";
import { ProductService } from "./ProductService";


describe('ProductService', () => {
    let productService: ProductService;
    let productRepository: Repository<Product>;
    let imageRepository: Repository<Image>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Image),
                    useClass: Repository,
                },
            ],
        }).compile();

        productService = module.get<ProductService>(ProductService);
        productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
        imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });

    describe('getAllProducts', () => {
        it('should return an array of products', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1', price: 19.99 }];
            jest.spyOn(productRepository, 'find').mockResolvedValueOnce(mockProducts as any);

            const result = await productService.getAllProducts();
            expect(result).toEqual(mockProducts);
        });
    });

    describe('getProductById', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { id: 1, name: 'Product 1', price: 19.99 };
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(mockProduct as any);

            const result = await productService.getProductById(1);
            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException if product not found', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

            await expect(productService.getProductById(1)).rejects.toThrowError(NotFoundException);
        });
    });

    //tests for createProduct, updateProduct, deleteProduct.

    describe('createProduct', () => {
        it('should create a new product with associated images', async () => {
            const mockProductData = { name: 'New Product', price: 29.99, status: ProductStatus.ACTIVE, imageIds: [1, 2] };
            const mockProduct = { id: 1, ...mockProductData };
    
            jest.spyOn(productRepository, 'create').mockReturnValueOnce(mockProduct as any);
            jest.spyOn(productRepository, 'save').mockResolvedValueOnce(mockProduct as any);
            jest.spyOn(imageRepository, 'findByIds').mockResolvedValueOnce([{ id: 1 }, { id: 2 }] as any);
    
            const result = await productService.createProduct(mockProductData);
            expect(result).toEqual(mockProduct);
        });
    
        it('should create a new product without associated images if imageIds is not provided', async () => {
            const mockProductData = { name: 'New Product', price: 29.99, status: ProductStatus.ACTIVE };
            const mockProduct = { id: 1, ...mockProductData };
    
            jest.spyOn(productRepository, 'create').mockReturnValueOnce(mockProduct as any);
            jest.spyOn(productRepository, 'save').mockResolvedValueOnce(mockProduct as any);
    
            const result = await productService.createProduct(mockProductData);
            expect(result).toEqual(mockProduct);
        });
    });
    
    describe('updateProduct', () => {
        it('should update a product with associated images', async () => {
            const mockUpdatedProductData = { name: 'Updated Product', price: 39.99, status: ProductStatus.ACTIVE, imageIds: [3, 4] };
            const mockProduct = { id: 1, name: 'Product 1', price: 19.99, images: [{ id: 1 }, { id: 2 }] };
    
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(mockProduct as any);
            jest.spyOn(productRepository, 'update').mockResolvedValueOnce(null);
            jest.spyOn(imageRepository, 'findByIds').mockResolvedValueOnce([{ id: 3 }, { id: 4 }] as any);
            jest.spyOn(imageRepository, 'save').mockResolvedValueOnce([{ id: 3 }, { id: 4 }] as any);
            jest.spyOn(productRepository, 'save').mockResolvedValueOnce({ ...mockProduct, ...mockUpdatedProductData } as any);
    
            const result = await productService.updateProduct(1, mockUpdatedProductData);
            expect(result).toEqual({ ...mockProduct, ...mockUpdatedProductData });
        });
    
        it('should update a product without associated images if imageIds is not provided', async () => {
            const mockUpdatedProductData = { name: 'Updated Product', price: 39.99, status: ProductStatus.ACTIVE };
            const mockProduct = { id: 1, name: 'Product 1', price: 19.99, images: [{ id: 1 }, { id: 2 }] };
    
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(mockProduct as any);
            jest.spyOn(productRepository, 'update').mockResolvedValueOnce(null);
            jest.spyOn(imageRepository, 'findByIds').mockResolvedValueOnce([{ id: 3 }, { id: 4 }] as any);
            jest.spyOn(imageRepository, 'save').mockResolvedValueOnce([{ id: 3 }, { id: 4 }] as any);
            jest.spyOn(productRepository, 'save').mockResolvedValueOnce({ ...mockProduct, ...mockUpdatedProductData, images: [] } as any);
    
            const result = await productService.updateProduct(1, mockUpdatedProductData);
            expect(result).toEqual({ ...mockProduct, ...mockUpdatedProductData, images: [] });
        });
    });
    
    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const mockProduct = { id: 1, name: 'Product 1', price: 19.99 };
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(mockProduct as any);
            jest.spyOn(productRepository, 'remove').mockResolvedValueOnce(null);

            const result = await productService.deleteProduct(1);
            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException if product not found', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);

            await expect(productService.deleteProduct(1)).rejects.toThrowError(NotFoundException);
        });
    });
});
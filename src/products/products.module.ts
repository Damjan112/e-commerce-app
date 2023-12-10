import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/graphql/models/Product";
import { ProductService } from "./ProductService";
import { Image } from "src/graphql/models/Image";
import { ProductController } from "src/REST/Product/ProductController";
import { ProductsResolver } from "./ProductResolver";

@Module({
    imports: [TypeOrmModule.forFeature([Product,Image])],
    providers: [ProductService,ProductsResolver],
    exports: [ProductService],
    controllers: [ProductController]
  })
  export class ProductModule {}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesResolver } from "./ImageResolver";
import { ImageService } from "./ImageService";
import { Image } from "src/graphql/models/Image";
import { Product } from "src/graphql/models/Product";
import { ImageController } from "src/REST/Image/ImageController";

@Module({
    imports: [TypeOrmModule.forFeature([Image, Product])],
    providers: [ImageService, ImagesResolver],
    exports: [ImageService],
    controllers: [ImageController]

  })
  export class ImageModule {}
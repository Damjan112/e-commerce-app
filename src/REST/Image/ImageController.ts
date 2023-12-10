import { Controller, Get, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { CreateImageInput } from "src/graphql/utils/CreateImageInput";
import { UpdateImageInput } from "src/graphql/utils/UpdateImageInput";
import { ImageService } from "src/images/ImageService";

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getAllImages() {
    return this.imageService.getAllImages();
  }

  @Get(':id')
  getImageById(@Param('id') id: number) {
    return this.imageService.getImageById(id);
  }

  @Post()
  createImage(@Body() createImageInput: CreateImageInput) {
    return this.imageService.createImage(createImageInput);
  }

  @Put(':id')
  updateImage(@Param('id') id: number, @Body() updateImageDto: UpdateImageInput) {
    return this.imageService.updateImage(id, updateImageDto);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: number) {
    return this.imageService.deleteImage(id);
  }
}
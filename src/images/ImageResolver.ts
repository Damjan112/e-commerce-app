import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { ImageService } from './ImageService'; 
import { Image } from '../graphql/models/Image'; 
import { CreateImageInput } from 'src/graphql/utils/CreateImageInput';
import { UpdateImageInput } from 'src/graphql/utils/UpdateImageInput';

@Resolver((of) => Image)
export class ImagesResolver {
  constructor(private readonly imagesService: ImageService) {}

  @Query((returns) => [Image])
  async images(): Promise<Image[]> {
    return this.imagesService.getAllImages();
  }

  @Query((returns) => Image, {nullable:true})
  async image(@Args('id', { type: () => ID }) id: number): Promise<Image> {
    return this.imagesService.getImageById(id);
  }
  @Mutation((returns) => Image)
  async createImage(@Args('input') input: CreateImageInput): Promise<Image> {
    return this.imagesService.createImage(input);
  }

  @Mutation((returns) => Image)
  async updateImage(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateImageInput,
  ): Promise<Image> {
    return this.imagesService.updateImage(id, input);
  }

  @Mutation((returns) => Image)
  async deleteImage(@Args('id', { type: () => ID }) id: number): Promise<Image> {
    return this.imagesService.deleteImage(id);
  }
}

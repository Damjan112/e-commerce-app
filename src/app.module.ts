import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './graphql/models/Product';
import { Image } from './graphql/models/Image';
import { ProductModule } from './products/products.module';
import { ImageModule } from './images/images.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'db_ecommerce',
      entities: [Product, Image],
      synchronize: true,
      logging: true,

    }),
    ProductModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

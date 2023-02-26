import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      categories: ['digital', 'apple'],
      name: 'Ipad Pro',
      price: '200',
    },
  ];

  findAll() {
    return this.products;
  }

  update(id: string, updateProductDto: any) {
    const existProduct = this.findOne(id);
    if (existProduct) {
      //TODO: IMPLEMENT update
    }
  }

  findOne(id: string) {
    const product = this.products.find((product) => product.id === +id);
    if (!product) {
      throw new HttpException(
        `Product with ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  create(productDto: any) {
    this.products.push(productDto);
  }

  remove(id: string) {
    const productId = this.products.findIndex((product) => product.id == +id);
    if (productId >= 0) {
      this.products.slice(productId, 1);
    }
  }
}

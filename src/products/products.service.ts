import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.productRepository.find({
      relations: {
        categories: true,
      },
    });
  }

  async findOne(id: string) {
    const product = this.productRepository.findOne({
      where: { id: +id },
      relations: {
        categories: true,
      },
    });
    if (!product) {
      throw new HttpException(
        `Product with ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    console.log('aqui');
    const categories = await Promise.all(
      createProductDto.categories.map((name) =>
        this.preloadCategoryByName(name),
      ),
    );

    const product = this.productRepository.create({
      ...createProductDto,
      categories,
    });
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const categories =
      updateProductDto.categories &&
      (await Promise.all(
        updateProductDto.categories.map((name) =>
          this.preloadCategoryByName(name),
        ),
      ));

    const product = await this.productRepository.preload({
      id: +id,
      ...updateProductDto,
      categories,
    });
    if (!product) {
      throw new NotFoundException(`The product ${id} not found`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  private async preloadCategoryByName(name: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      return existingCategory;
    }
    return this.categoryRepository.create({ name });
  }
}

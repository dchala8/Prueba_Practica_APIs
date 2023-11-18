import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productRepository: Repository<ProductoEntity>,
  ) {}

  //Obtener todas los productos
  async findAll(): Promise<ProductoEntity[]> {
    return await this.productRepository.find({
      relations: ['productos'],
    });
  }

  //Obtener un producto
  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['tienda'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID Dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  //Crear un producto
  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.productRepository.save(producto);
  }

  //Actualizar un producto
  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productRepository.findOne({
        where: { id },
      });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'El Producto dado por ese ID no se encontro',
        BusinessError.NOT_FOUND,
      );
    producto.id = id;
    return await this.productRepository.save(producto);
  }

  //Eliminar un producto
  async delete(id: string) {
    const producto: ProductoEntity = await this.productRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto dado por ese ID no se encontro',
        BusinessError.NOT_FOUND,
      );

    await this.productRepository.remove(producto);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaProductoService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addStoreToProduct(
    productId: string,
    tiendaId: string,
  ): Promise<ProductoEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el ID dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    producto.tiendas = [...producto.tiendas, tienda];
    return await this.productoRepository.save(producto);
  }

  async findStoresFromProduct(productoId: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas;
  }

  async findStoreFromProduct(
    productoId: string,
    tiendaId: string,
  ): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el ID dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const productoTienda: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!productoTienda)
      throw new BusinessLogicException(
        'La tienda con el ID dado no fue encontrada',
        BusinessError.PRECONDITION_FAILED,
      );

    return productoTienda;
  }

  async updateStoresFromProduct(
    productoId: string,
    tiendas: TiendaEntity[],
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });

    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < tiendas.length; i++) {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id: tiendas[i].id },
      });
      if (!tienda)
        throw new BusinessLogicException(
          'La tienda con el ID dado no fue encontrada',
          BusinessError.NOT_FOUND,
        );
    }

    producto.tiendas = tiendas;
    return await this.productoRepository.save(producto);
  }

  async deleteStoreFromProduct(productoId: string, tiendaId: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el ID dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const productoTienda: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!productoTienda)
      throw new BusinessLogicException(
        'La tienda dada por el ID no esta asociada al producto dado por el ID',
        BusinessError.PRECONDITION_FAILED,
      );

    producto.tiendas = producto.tiendas.filter((e) => e.id !== tiendaId);
    await this.productoRepository.save(producto);
  }
}

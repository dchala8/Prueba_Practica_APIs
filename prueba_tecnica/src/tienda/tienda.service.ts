import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  //Obtener todas las Tiendas
  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({
      relations: ['producto'],
    });
  }

  //Obtener una Tienda
  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['producto'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el ID Dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return tienda;
  }

  //Crear una Tienda
  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length > 3) {
      throw new BusinessLogicException(
        'La ciudad esta dada por un codigo de 3 caracteres',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.tiendaRepository.save(tienda);
  }

  //Actualizar una Tienda
  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persistedTienda)
      throw new BusinessLogicException(
        'La tienda dada por ese ID no se encontro',
        BusinessError.NOT_FOUND,
      );
    tienda.id = id;
    return await this.tiendaRepository.save(tienda);
  }

  //Eliminar una Tienda
  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda dada por ese ID no se encontro',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }
}

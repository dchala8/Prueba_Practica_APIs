import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: 'MED',
        direccion: faker.location.direction(),
      });
      tiendaList.push(tienda);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendaList.length);
  });

  it('findOne should return a Tienda by id', async () => {
    const storedTienda: TiendaEntity = tiendaList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
    expect(tienda.ciudad).toEqual(storedTienda.ciudad);
    expect(tienda.direccion).toEqual(storedTienda.direccion);
  });

  it('findOne should throw an exception for an invalid Tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La tienda con el ID Dado no fue encontrada',
    );
  });

  it('create should return a new Tienda', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: 'MED',
      direccion: faker.location.direction(),
      producto: new ProductoEntity(),
    };

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: newTienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad);
    expect(storedTienda.direccion).toEqual(newTienda.direccion);
  });

  it('update should modify a Tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.nombre = 'New name';
    tienda.direccion = 'New address';
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre);
    expect(storedTienda.direccion).toEqual(tienda.direccion);
  });

  it('update should throw an exception for an invalid Tienda', async () => {
    let tienda: TiendaEntity = tiendaList[0];
    tienda = {
      ...tienda,
      nombre: 'New name',
      direccion: 'New address',
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'La tienda dada por ese ID no se encontro',
    );
  });

  it('delete should remove a Tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);
    const deletedienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(deletedienda).toBeNull();
  });

  it('delete should throw an exception for an invalid Tienda', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La tienda dada por ese ID no se encontro',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TiendaProductoService } from '../tienda-producto/tienda-producto.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendas: TiendaEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();

    tiendas = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: 'BOG',
        direccion: faker.location.streetAddress(),
      });
      tiendas.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.commerce.price(),
      tipo: 'Perecedero',
      tiendas: tiendas,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an tienda to a product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.commerce.price(),
      tipo: 'No perecedero',
      tiendas: [],
    });

    const result: ProductoEntity = await service.addStoreToProduct(
      newProducto.id,
      newTienda.id,
    );

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('addStoreToProduct should thrown exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.addStoreToProduct(newTienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el ID dado no fue encontrada',
    );
  });

  it('addStoreToProduct should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el ID dado no fue encontrado',
    );
  });

  it('findStoresFromProduct should return tiendas by product', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(
      producto.id,
    );
    expect(tiendas.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid Producto', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el ID dado no fue encontrado',
    );
  });

  it('findStoreFromProduct should return Tienda by Producto', async () => {
    const tienda: TiendaEntity = tiendas[0];
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(
      producto.id,
      tienda.id,
    );
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('findStoreFromProduct should throw an exception for an invalid Tienda', async () => {
    await expect(() =>
      service.findStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el ID dado no fue encontrada',
    );
  });

  it('findStoreFromProduct should throw an exception for an invalid Producto', async () => {
    await expect(() =>
      service.findStoreFromProduct('0', tiendas[0].id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el ID dado no fue encontrado',
    );
  });

  it('findStoreFromProduct should throw an exception for an tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.findStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el ID dado no fue encontrada',
    );
  });

  it('updateStoresFromProduct should update Tienda list for a Product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    const updatedProducto: ProductoEntity =
      await service.updateStoresFromProduct(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('updateStoresFromProduct should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.updateStoresFromProduct('0', [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el ID dado no fue encontrado',
    );
  });

  it('updateStoresFromProduct should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendas[0];
    newTienda.id = '0';

    await expect(() =>
      service.updateStoresFromProduct(producto.id, [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el ID dado no fue encontrada',
    );
  });

  it('deleteStoreFromProduct should remove an tienda from a producto', async () => {
    const tienda: TiendaEntity = tiendas[0];

    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(
      (a) => a.id === tienda.id,
    );

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid Tienda', async () => {
    await expect(() =>
      service.deleteStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el ID dado no fue encontrada',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid Producto', async () => {
    await expect(() =>
      service.deleteStoreFromProduct('0', tiendas[0].id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el ID dado no fue encontrado',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.deleteStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda dada por el ID no esta asociada al producto dado por el ID',
    );
  });
});

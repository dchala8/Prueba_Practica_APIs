import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        precio: faker.commerce.price(),
        tipo: faker.animal.cat(),
      });
      productoList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Productos', async () => {
    const producto: ProductoEntity[] = await service.findAll();
    expect(producto).not.toBeNull();
    expect(producto).toHaveLength(productoList.length);
  });

  it('findOne should return a Product by id', async () => {
    const storedTienda: ProductoEntity = productoList[0];
    const tienda: ProductoEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
    expect(tienda.precio).toEqual(storedTienda.precio);
    expect(tienda.tipo).toEqual(storedTienda.tipo);
  });

  it('findOne should throw an exception for an invalid Producto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El producto con el ID Dado no fue encontrada',
    );
  });

  it('create should return a new product', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.company.name(),
      tipo: faker.location.city(),
      precio: faker.location.direction(),
      tiendas: [new TiendaEntity()],
    };

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
    expect(storedProducto.tipo).toEqual(newProducto.tipo);
  });

  it('update should modify a Producto', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.nombre = 'New name';
    producto.precio = '0';
    const updatedProducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedProducto).not.toBeNull();
    const storedPrecio: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedPrecio).not.toBeNull();
    expect(storedPrecio.nombre).toEqual(producto.nombre);
    expect(storedPrecio.precio).toEqual(producto.precio);
  });

  it('update should throw an exception for an invalid Producto', async () => {
    let producto: ProductoEntity = productoList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      precio: '0',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'El Producto dado por ese ID no se encontro',
    );
  });

  it('delete should remove a Producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
    const deletedproducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedproducto).toBeNull();
  });

  it('delete should throw an exception for an invalid Producto', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El producto dado por ese ID no se encontro',
    );
  });
});

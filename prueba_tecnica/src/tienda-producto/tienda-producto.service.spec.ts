import { Test, TestingModule } from '@nestjs/testing';
import { TiendaProductoService } from './tienda-producto.service';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

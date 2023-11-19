import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaProductoService } from './tienda-producto.service';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaProductoController } from './tienda-producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity, ProductoEntity])],
  providers: [TiendaProductoService],
  controllers: [TiendaProductoController],
})
export class TiendaProductoModule {}

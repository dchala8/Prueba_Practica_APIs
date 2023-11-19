/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { TiendaProductoService } from './tienda-producto.service';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from 'src/tienda/tienda.dto';
import { TiendaEntity } from 'src/tienda/tienda.entity';


@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaProductoController {
   constructor(private readonly tiendaProductoService: TiendaProductoService){}

   @Post(':productId/stores/:tiendaId')
   async addStoreToProduct(@Param('productId') productId: string, @Param('tiendaId') tiendaId: string){
       return await this.tiendaProductoService.addStoreToProduct(productId, tiendaId);
   }

   @Get(':productId/stores/:tiendaId')
   async findStoreFromProduct(@Param('productId') productId: string, @Param('tiendaId') tiendaId: string){
       return await this.tiendaProductoService.findStoreFromProduct(productId, tiendaId);
   }

   @Get(':productId/stores')
   async findStoresFromProduct(@Param('productId') productId: string){
       return await this.tiendaProductoService.findStoresFromProduct(productId);
   }

   @Put(':productId/stores')
   async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('productId') productId: string){
       const tiendas = plainToInstance(TiendaEntity, tiendasDto)
       return await this.tiendaProductoService.updateStoresFromProduct(productId, tiendas);
   }

   @Delete(':productId/stores/:tiendaId')
   @HttpCode(204)
   async deleteStoreFromProduct(@Param('productId') productId: string, @Param('tiendaId') tiendaId: string){
       return await this.tiendaProductoService.deleteStoreFromProduct(productId, tiendaId);
   }
}
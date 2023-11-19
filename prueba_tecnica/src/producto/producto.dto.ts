import { IsNotEmpty, IsString } from 'class-validator';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly precio: string;

  @IsString()
  @IsNotEmpty()
  readonly tipo: string;
}

import { ProductoEntity } from '../producto/producto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @OneToMany(() => ProductoEntity, (producto) => producto.tienda)
  productos: ProductoEntity[];
}

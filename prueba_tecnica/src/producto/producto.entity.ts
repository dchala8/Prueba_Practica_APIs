import { TiendaEntity } from '../tienda/tienda.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  precio: string;

  @Column()
  tipo: string;

  @OneToMany(() => TiendaEntity, (tienda) => tienda.producto)
  tiendas: TiendaEntity[];
}

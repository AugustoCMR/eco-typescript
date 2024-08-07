import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./productModel";

@Entity()
export class InsertProductOperation extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.insertProductOperation)
    produto: Product;

    @Column()
    quantidade: number;

    @Column("float")
    valorReal: number;
}
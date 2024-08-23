import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "./productModel";
import { RemoveProductOperation } from "./removeProductOperationModel";

@Entity()
export class RemoveProductOperationDetail extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.removeProductOperationDetail)
    product: Product;

    @Column("float")
    ecopoints: number;

    @Column()
    quantidade: number;

    @Column("float")
    subtotal: number;

    @ManyToOne(() => RemoveProductOperation, removeProductOperation => removeProductOperation.removeProductOperationDetail)
    removeProductOperation: RemoveProductOperation;

    @Column("float")
    saldoAtualCustomer: number;
}
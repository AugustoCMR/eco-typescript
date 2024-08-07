import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./productModel";
import { Customer } from "./customerModel";
import { RemoveProductOperationDetail } from "./removeProductOperationDetailModel";

@Entity()
export class RemoveProductOperation extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: number

    @ManyToOne(() => Customer, customer => customer.removeProductOperation)
    usuario: Customer;

    @OneToMany(() => RemoveProductOperationDetail, removeProductOperationDetail => removeProductOperationDetail.removeProductOperation)
    removeProductOperationDetail: RemoveProductOperationDetail;

    @Column("float")
    ecoSaldoTotal: number;
}
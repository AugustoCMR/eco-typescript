import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
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

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => Customer, customer => customer.removeProductOperation)
    customer: Customer;

    @OneToMany(() => RemoveProductOperationDetail, removeProductOperationDetail => removeProductOperationDetail.removeProductOperation)
    removeProductOperationDetail: RemoveProductOperationDetail;

    @Column("float")
    ecoSaldoTotal: number;
}
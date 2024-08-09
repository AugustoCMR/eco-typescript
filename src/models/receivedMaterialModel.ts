import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Customer } from "./customerModel";
import { ReceivedMaterialDetail } from "./receivedMaterialDetailModel";

@Entity()
export class ReceivedMaterial extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true} )
    codigo: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column("float")
    ecoSaldoTotal: number;

    @OneToMany(() => ReceivedMaterialDetail, receivedMaterialDetail => receivedMaterialDetail.receivedMaterial)
    receivedMaterialsDetail: ReceivedMaterialDetail;

    @ManyToOne(() => Customer, customer => customer.receivedMaterials)
    customer: Customer;
}
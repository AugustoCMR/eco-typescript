import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Customer } from "./customerModel";
import { ReceivedMaterialDetail } from "./receivedMaterialDetailModel";

@Entity()
export class ReceivedMaterial extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true} )
    codigo: number;

    @Column("float")
    ecoSaldoTotal: number;

    @OneToMany(() => ReceivedMaterialDetail, receivedMaterialDetail => receivedMaterialDetail.receivedMaterial)
    receivedMaterialsDetail: ReceivedMaterialDetail;

    @ManyToOne(() => Customer, customer => customer.receivedMaterials)
    customer: Customer;
}
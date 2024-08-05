import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
import { Residue } from "./residueModel";
import { Material } from "./materialModel";
import { ReceivedMaterial } from "./receivedMaterialModel";

@Entity()
export class ReceivedMaterialDetail extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column("float")
    ecopoint:  number;

    @Column()
    quantidade: number;

    @ManyToOne(() => ReceivedMaterial, receivedMaterial => receivedMaterial.receivedMaterialsDetail)
    receivedMaterial: ReceivedMaterial;

    @OneToOne(() => Material, material => material.receivedMaterialDetail)
    material: Material

    @Column()
    unidade_medida: string;
}
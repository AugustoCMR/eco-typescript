import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from "typeorm";
import { Residue } from "./residueModel";
import { ReceivedMaterialDetail } from "./receivedMaterialDetailModel";

@Entity()
export class Material extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true} )
    codigo: number;

    @Column( {unique: true, length: 25} )
    nome: string;

    @Column()
    unidade_medida: string;

    @Column("float")
    ecopoint:  number;

    @Column()
    quantidade: number;

    @OneToMany(() => Residue, residue => residue.materials)
    residue: Residue;

    @OneToOne(() => ReceivedMaterialDetail, receivedMaterialDetail => receivedMaterialDetail.material)
    receivedMaterialDetail: ReceivedMaterialDetail;
}
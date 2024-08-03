import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Residue } from "./residueModel";

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

    @ManyToOne(() => Residue, residue => residue.materials)
    residue: Residue;
}
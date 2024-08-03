import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./materialModel";

@Entity()
export class Residue extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: number;

    @Column({ unique: true, length: 30 })
    nome: string;

    @OneToMany(() => Material, material => material.residue)
    materials: Material;
}
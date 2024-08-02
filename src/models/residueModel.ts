import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Residue extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: number;

    @Column({ unique: true, length: 30 })
    nome: string;
}
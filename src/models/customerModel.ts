import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { ReceivedMaterial } from "./receivedMaterialModel";

@Entity()
export class Customer extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: number;

    @Column({ length: 40 })
    nome: string;

    @Column({ length: 40, unique: true })
    email: string;

    @Column("float", {default: 0})
    ecosaldo: number;

    @Column({ unique: true })
    cpf: number;

    @Column({ length: 20 })
    pais: string;

    @Column({ length: 25 })
    estado: string;

    @Column({ length: 25 })
    cidade: string;

    @Column()
    cep: number;

    @Column({ length: 50 })
    rua: string;

    @Column({ length: 50 })
    bairro: string;

    @Column({ length: 20 })
    numero: string;

    @OneToMany(() => ReceivedMaterial, receivedMaterial => receivedMaterial.customer)
    receivedMaterials: ReceivedMaterial;
}
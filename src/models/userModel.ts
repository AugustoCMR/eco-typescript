import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    @Column({ length: 40 })
    nome: string;

    @Column({ length: 40 })
    email: string;

    @Column("float")
    ecosaldo: number;

    @Column()
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
}
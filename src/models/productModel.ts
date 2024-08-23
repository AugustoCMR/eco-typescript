import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InsertProductOperation } from "./insertProductOperationModel";
import { RemoveProductOperationDetail } from "./removeProductOperationDetailModel";

@Entity()
export class Product extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: number;

    @Column({ unique: true, length: 30 })
    nome: string;

    @Column({default: 0, nullable: true})
    quantidade: number;

    @Column("float")
    ecopoint: number;

    @OneToMany(() =>  InsertProductOperation, insertProductOperation => insertProductOperation.produto)
    insertProductOperation: InsertProductOperation;

    @OneToMany(() => RemoveProductOperationDetail, removeProductOperationDetail => removeProductOperationDetail.product)
    removeProductOperationDetail: RemoveProductOperationDetail;
}
import { QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source"

export class ManagerDB
{
    async openConnection()
    {
        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        return queryRunner;
    }
}
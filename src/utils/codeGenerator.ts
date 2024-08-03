import { AppDataSource } from "../data-source";

export class CodeGenerator 
{

    async generateCode(entidade: string):  Promise<number>
    {
        const queryRunner = await AppDataSource.createQueryRunner();

        let query = await queryRunner.manager.query
        (
            `SELECT codigo FROM ${entidade} ORDER BY codigo DESC LIMIT 1` 
        );

        if(query.length === 0)
        {
            return 1;
        }

        const lastCode = query[0].codigo;

        return lastCode + 1;
    }
}

import { Repository } from "typeorm";

export async function validateIdParam(repository: Repository<any>, entityName: string, code: number) 
{

    const item = await repository.findOneBy({ codigo: code });

    if (!item) 
    {
        throw new Error(`O ID do ${entityName} náo foi encontrado`);
    }  
}
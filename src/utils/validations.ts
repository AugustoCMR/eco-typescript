import { Repository, Not } from "typeorm";

export async function validateIdParam(repository: Repository<any>, entityName: string, code: number) 
{

    const item = await repository.findOneBy({ codigo: code });

    if (!item) 
    {
        throw new Error(`O ID do ${entityName} não foi encontrado`);
    }  

    return item;
}

export async function validateEntityName(repository: Repository<any>, entityName: string,  nameEntered: string, nameColumnModel: string, code?: number)
{

    let checkName;

    if(code)
    {
        checkName = await repository.findOne(
        {
            where: 
            {
                [nameColumnModel]: nameEntered,
                codigo: Not(code)
            }
        });
    }
    else
    {
        checkName = await repository.findOneBy(
            {
                [nameColumnModel]: nameEntered
            }
        )
    }
   

    if (checkName) 
    {
       throw new Error(`O ${entityName} informado já possui cadastro`);
    }
}

export async function validateDelete (repository: Repository<any>, objectEntity: object,  entityName: string)
{
 
    const checkEntity = await repository.findOneBy(objectEntity);

    if(checkEntity)
    {
        throw new Error(`Não é possível deletar um ${entityName} que possui registros.`);
    }
}

export async function validateIdBody(repository: Repository<any>, code: number, columnName: string)
{
    const item = await repository.findOneBy({ codigo: code });

    if (!item) 
    {
        throw new Error(`${columnName} não foi encontrado`);
    }

    return item;
}



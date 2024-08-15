import { Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";

export function validateIdParam(repository: Repository<any>,errorMessage: string) 
{
    return async (req: Request, res: Response, next: NextFunction) => {
        try 
        {
            const { id } = req.params;

            const itemId = parseInt(id);

            const item = await repository.findOneBy({ codigo: itemId });

            if (!item) {
                return res.status(400).json({ message: errorMessage });
            }

            next();
        } catch (error) 
        {
            console.error("Erro ao validar ID:", error);
            return res.status(500).json({ mensagem: `Ocorreu um erro interno do servidor: ${error}` });
        }
    };
}

export function validateIdBody(repository: Repository<any>, bodyName: string, columnNameId: string, errorMessage: string)
{
    return async (req: Request, res: Response, next: NextFunction) => {
        try 
        {   
            const body = req.body[bodyName];   
            
            if(body[columnNameId])
            {
                const itemId = parseInt(body[columnNameId]);

                const item = await repository.findOneBy({ codigo: itemId });

                if (!item) {
                    return res.status(400).json({ message: errorMessage });
                }
    
                next();
            }
            else
            {
                next();
            }
           
        } catch (error) 
        {
            console.error("Erro ao validar ID:", error);
            return res.status(500).json({ mensagem: `Ocorreu um erro interno do servidor: ${error}` });
        }
    };
}

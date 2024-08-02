import { Request, Response } from 'express';
import { ResidueService } from "../service/residueService"

export class ResidueController
{   

    private residueService: ResidueService;

    constructor()
    {
        this.residueService = new ResidueService();
    }

    createResidue = async (req: Request, res: Response) =>
    {
        try
        {
            await this.residueService.createResidue(req.body);

            res.status(201).json({ message: 'Resíduo cadastrado com sucesso'});
        }
        catch(error)
        {
            console.error("Erro ao criar resíduo:", error);
            res.status(400).json({ error: error });
        }
    }
}
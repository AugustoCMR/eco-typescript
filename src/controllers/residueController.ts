import { Request, Response } from 'express';
import { ResidueService } from "../service/residueService"
import { residueRepository } from '../repositories/residueRepository';

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
            await this.residueService.createResidue(req.body.residue);

            res.status(201).json({ message: 'Resíduo cadastrado com sucesso'});
        }
        catch(error)
        {
            console.error("Erro ao criar resíduo:", error);
            res.status(400).json({ error: error });
        }
    }

    updateResidue = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = parseInt(req.params.id);
            await this.residueService.updateResidue(code, req.body.residue);

            res.status(201).json( {message: "Usuário atualizado com sucesso"} );
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar resíduo:", error);
            res.status(400).json({ error: error });
        }
    }

    deleteResidue = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = parseInt(req.params.id);
            await this.residueService.deleteResidue(code);

            res.status(204).send();
        } 
        catch (error) 
        {
            console.error("Erro ao deletar resíduo:", error);
            res.status(400).json({ error: error });
        }
    }

    async getAllResidues(req: Request, res: Response)
    {
        try 
        {
            const residues = await residueRepository.find();

            res.json(residues);
        } 
        catch (error) 
        {
            console.error("Erro ao buscar resíduos:", error);
            res.status(500).json({ error: error });
        }
    }

    async getResidueById(req: Request, res: Response)
    {
        try 
        {
            const code = parseInt(req.params.id);
            const residue = await residueRepository.findOneBy({ codigo: code });
            
            res.json(residue); 
        } 
        catch (error) 
        {
            console.error("Erro ao buscar resíduo:", error);
            res.status(500).json({ error: error});
        }
    }
}   
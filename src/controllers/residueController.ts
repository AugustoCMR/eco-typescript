import {NextFunction, Request, Response} from 'express';
import { ResidueService } from "../service/residueService"
import { residueRepository } from '../repositories/residueRepository';
import { ZodError } from 'zod';
import {residueSchema} from "../validators/residueValidator";
import {idSchema} from "../validators/idValidator";

export class ResidueController
{   

    private residueService: ResidueService;

    constructor()
    {
        this.residueService = new ResidueService();
    }

    createResidue = async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const validatedData = residueSchema.parse(req.body.residue);

            await this.residueService.createResidue(validatedData);

            res.status(201).json({ message: 'Resíduo cadastrado com sucesso'});
        }
        catch(error)
        {
            console.error("Erro ao criar resíduo:", error);

            next(error);
        }
    }

    updateResidue = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const idValidated = parseInt(idSchema.parse(req.params.id));
            const validatedData  = residueSchema.parse(req.body.residue);

            await this.residueService.updateResidue(idValidated, validatedData);

            res.status(201).json( {message: "Usuário atualizado com sucesso"} );
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar resíduo:", error);

            next(error);
        }
    }

    deleteResidue = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const code = req.params.id;
            await this.residueService.deleteResidue(code);

            res.status(204).send();
        } 
        catch (error) 
        {
            console.error("Erro ao deletar resíduo:", error);

            next(error);
        }
    }

    async getAllResidues(req: Request, res: Response, next: NextFunction)
    {
        try 
        {
            const residues = await residueRepository.find();

            res.json(residues);
        } 
        catch (error) 
        {
            console.error("Erro ao buscar resíduos:", error);
            next(error);
        }
    }

    getResidueById = async (req: Request, res: Response, next: NextFunction) =>
    {
        try 
        {
            const code = req.params.id;
            const residue = await this.residueService.getResidueById(code);
 
            res.json(residue); 
        } 
        catch (error) 
        {
            console.error("Erro ao buscar resíduo:", error);

            next(error);
        }
    }
}   
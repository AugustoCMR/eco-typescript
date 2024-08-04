import { Request, Response } from 'express';
import { MaterialService } from '../service/materialService';
import { materialRepository } from '../repositories/materialRepository';

export class MaterialController
{
    private materialService = new MaterialService;

    constructor()
    {
        this.materialService = new MaterialService();
    }

    createMaterial = async (req: Request, res: Response) =>
    {
        try 
        {
            await this.materialService.createMaterial(req.body);

            res.status(201).json({ message: 'Material cadastrado com sucesso' });
        } 
        catch (error) 
        {
            console.error("Erro ao criar material:", error);
            res.status(400).json({ error: error });
        }
    }

    updateMaterial = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = parseInt(req.params.id);
            await this.materialService.updateMaterial(code, req.body);
            
            res.status(201).json( {message: "Material atualizado com sucesso"} )
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar material:", error);
            res.status(400).json({ error: error });
        }
    }

    deleteMaterial = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = parseInt(req.params.id);
            await this.materialService.deleteMaterial(code);

            res.status(204).send();
        }
        catch (error) 
        {
            console.error("Erro ao deletar material:", error);
            res.status(400).json({ error: error });
        }

    }

    async getAllMaterials (req: Request, res: Response)
    {
        try
        {
            const materials = await materialRepository.find();

            res.json(materials);
        }
        catch (error)
        {
            console.error("Erro ao buscar materiais:", error);
            res.status(500).json({ error: error });
        }
    }

    async getMaterialById(req: Request, res: Response)
    {
        try 
        {
            const code = parseInt(req.params.id);
            const material = await materialRepository.findOneBy({codigo: code});

            if(material)
            {
                res.json(material);
            }
            else
            {
                res.status(404).json({ message: 'Material não encontrado'});
            }
        } 
        catch (error) 
        {
            console.error("Erro ao buscar material:", error);
            res.status(500).json({ error: error});
        }
    }
}
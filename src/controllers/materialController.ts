import { Request, Response } from 'express';
import { MaterialService } from '../service/materialService';
import { materialRepository } from '../repositories/materialRepository';
import { AppDataSource } from '../data-source';
import { Customer } from '../models/customerModel';
import { ZodError } from 'zod';

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
            await this.materialService.createMaterial(req.body.material);

            res.status(201).json({ message: 'Material cadastrado com sucesso' });
        } 
        catch (error) 
        {
            console.error("Erro ao criar material:", error);
            
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }

        }
    }

    updateMaterial = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = req.params.id;
            await this.materialService.updateMaterial(code, req.body.material);
            
            res.status(201).json( {message: "Material atualizado com sucesso"} )
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar material:", error);
            
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
    }
    }

    deleteMaterial = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = req.params.id;
            await this.materialService.deleteMaterial(code);

            res.status(204).send();
        }
        catch (error) 
        {
            console.error("Erro ao deletar material:", error);
           
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
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

    getMaterialById = async (req: Request, res: Response) =>
    {
        try 
        {
            const code = req.params.id;
            const material = await this.materialService.getMaterialById(code);
            

            res.json(material);  
        } 
        catch (error) 
        {
            console.error("Erro ao buscar material:", error);
            
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
    }

    receivedMaterial = async (req: Request, res: Response) =>
    {
        try 
        {   
            await this.materialService.receivedMaterial(req.body.master, req.body.detail);

            res.status(201).json({ message: 'Recebimento de material cadastrado com sucesso.' });
        } 
        catch (error) 
        {
            console.error("Erro ao cadastrar recebimento de materiais:", error);
            
            if(error instanceof ZodError)
            {
                res.status(400).json({ error: error.issues[0].message })
            }
            else
            {
                error instanceof Error ?  res.status(404).json({ error: error.message }) : res.status(500).json({ error: "Ocorreu um erro interno no servidor" });
            }
        }
    }

    async detailedMaterialFetch (req: Request, res: Response)
    {
        try 
        {
           
            const materials = await AppDataSource.getRepository(Customer)
            .createQueryBuilder('customer')
            .innerJoinAndSelect('customer.receivedMaterials', 'receivedMaterials')
            .innerJoinAndSelect('receivedMaterials.receivedMaterialsDetail', 'receivedMaterialsDetail')
            .getMany();
            
            res.json(materials);
        } 
        catch (error) 
        {
            console.error("Erro gerar consulta:", error);
            res.status(500).json({ error: error});
        }
    }
}
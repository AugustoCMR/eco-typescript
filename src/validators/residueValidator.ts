import { z } from 'zod';

export const residueSchema = z.object
(
    {
        codigo: z.number().optional(),
        nome: z.string().min(1, "Nome do Resíduo é obrigatório")
    }
)
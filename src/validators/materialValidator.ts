import { z } from 'zod';

export const materialSchema = z.object
(
    {
        codigo: z.number().optional(),
        nome: z.string().min(1, "O campo nome é obrigatório"),
        unidade_medida: z.string().min(1, "O campo unidade de medida é obrigatório"),
        ecopoint: z.number
        (
            {
                required_error: "O campo Eco Points é obrigatório",
                invalid_type_error: "O campo Eco Points deve conter apenas números"
            }
        ).positive("O campo Eco Points deve conter um valor maior que zero"),
        residue: z.number
        (
            {
                required_error: "O campo resíduo é obrigatório",
                invalid_type_error: "O campo resíduo deve conter apenas números"
            }
        ).int("O campo resíduo deve conter apenas números inteiros")
    }
)
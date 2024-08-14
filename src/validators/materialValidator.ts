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
        ),
        residue: z.number
        (
            {
                required_error: "O campo resíduo é obrigatório",
                invalid_type_error: "O campo resíduo deve conter apenas números"
            }
        ),
        quantidade: z.number
        (
            {
                required_error: "O campo quantidade é obrigatório",
                invalid_type_error: "O campo quantidade deve conter apenas números"
            }
        )
    }
)
import { z } from 'zod';

export const productSchema = z.object
(
    {
        codigo: z.number().optional(),
        nome: z.string().min(1, "O campo nome é obrigatório"),
        quantidade: z.number
        (
            {
                required_error: "O campo quantidade é obrigatório",
                invalid_type_error: "O campo quantidade deve conter apenas números"
            }
        ),
        ecopoint: z.number
        (
            {
                required_error: "O campo ecopoint é obrigatório",
                invalid_type_error: "O campo ecopoint deve conter apenas números"
            }
        )
    }
)
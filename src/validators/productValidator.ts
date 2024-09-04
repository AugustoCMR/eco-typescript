import { z } from 'zod';

export const productSchema = z.object
(
    {
        codigo: z.number().optional(),
        nome: z.string(
            {
                required_error: "Nome é obrigatório",
                invalid_type_error: "Nome deve conter caracteres além de números"
            }
        ).min(1, "O campo nome é obrigatório"),
        quantidade: z.number
        (
            {
                required_error: "O campo quantidade é obrigatório",
                invalid_type_error: "O campo quantidade deve conter apenas números"
            }
        ).positive("Quantidade deve ser maior que zero").optional(),
        ecopoint: z.number
        (
            {
                required_error: "O campo ecopoint é obrigatório",
                invalid_type_error: "O campo ecopoint deve conter apenas números"
            }
        ).positive("Eco Point deve ser maior que zero")
    }
)

export type productSchema = z.infer<typeof productSchema>;
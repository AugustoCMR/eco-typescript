import { z } from "zod";

const insertProductsItemSchema = z.object(
    {
        produto: z.number(
            {
                required_error: "O campo produto é obrigatório",
                invalid_type_error: "O campo produto deve conter apenas números"
            }
        ).positive("Produto deve ser maior que zero").int("O campo resíduo deve conter apenas números inteiros"),
        quantidade: z.number(
            {   
                required_error: "Quantidade é obrigatório",
                invalid_type_error: "O campo quantidade deve conter apenas números"
            }
          ).positive("Quantidade deve ser maior que zero").int("O campo quantidade deve conter apenas números inteiros"),
        valorReal: z.number(
            {
                required_error: "Valor é obrigatório",
                invalid_type_error: "O campo valor deve conter apenas números"
            }
          ).positive("Valor deve ser maior que zero")
    }
);

const insertProductSchema = z.array(insertProductsItemSchema);

export const schemaInsertProduct = z.object(
    {
        products: insertProductSchema
    }
)

export type insertProductSchema = z.infer<typeof schemaInsertProduct>;
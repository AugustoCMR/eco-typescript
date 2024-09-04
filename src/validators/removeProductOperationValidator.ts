import { z } from "zod";
import { customerSchema } from "./customerValidator";

const masterSchema = z.object({

    codigo: z.number().optional(),
    customer: z.number(
        {   
            required_error: "O campo usuário é obrigatório",
            invalid_type_error: "O campo usuário deve conter apenas números"
        }
    ).positive("Usuário deve ser maior que zero").int("O campo usuário deve conter apenas números inteiros"), 
    ecoSaldoTotal: z.number(
        {   
            invalid_type_error: "O campo saldo total deve conter apenas números"
        }
    ).positive("Saldo Total deve ser maior que zero"),
});

export const removeProductOperationSchema = z.object({
    id: z.number(),
    codigo: z.number().optional(),
    created_at: z.date().optional(),
    ecoSaldoTotal: z.number(),
    customer: customerSchema
  })

const detailItemSchema = z.object({
    produto: z.number(
      {
          invalid_type_error: "O campo produto deve conter apenas números"
      }
    ).positive("Produto deve ser maior que zero").int("O campo produto deve conter apenas números inteiros"),
    quantidade: z.number(
      {
          invalid_type_error: "O campo quantidade deve conter apenas números"
      }
    ).positive("Quantidade deve ser maior que zero").int("O campo quantidade deve conter apenas números inteiros"), 
    ecopoints: z.number(
      {
          invalid_type_error: "O campo Eco Points deve conter apenas números"
      }
    ).positive("Eco Point deve ser maior que zero") , 
    subtotal: z.number(
      {
          invalid_type_error: "O campo subtotal deve conter apenas números"
      }
    ).positive("Subtotal deve ser maior que zero") ,
    saldoAtualCustomer: z.number().optional(),
    removeProductOperation: removeProductOperationSchema.optional()
  });

  
const detailSchema = z.array(detailItemSchema);

export const schemaMasterDetail = z.object({
  master: masterSchema,
  detail: detailSchema
});

export type removeProductSchema = z.infer<typeof schemaMasterDetail>
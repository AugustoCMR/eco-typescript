import { z } from 'zod';

export const customerSchema = z.object({
    codigo: z.number().optional(),
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O e-mail deve ser válido"),
    ecosaldo: z.number().optional(), 
    cpf: z.string
    (
        {
            required_error: "CPF é obrigatório",
            invalid_type_error: "CPF deve conter apenas números"
        }
    )
    .length(11, "CPF deve conter 11 dígitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"), 
    pais: z.string().min(1, "País é obrigatório"),
    estado: z.string().min(1, "Estado é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatório"),
    cep: z.string
    (
        {
            required_error: "CEP é obrigatório",
            invalid_type_error: "CEP deve conter apenas números"
        }
    )
    .regex(/^\d+$/, "CEP deve conter apenas números"),
    rua: z.string().min(1, "Rua é obrigatório"),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório")
});

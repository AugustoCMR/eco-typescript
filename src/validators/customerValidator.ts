import { z } from 'zod';

export const customerSchema = z.object
(
    {
        codigo: z.number().optional(),
        nome: z.string().min(1, "O campo nome é obrigatório"),
        email: z.string
        (
            {
                required_error: "O campo e-mail é obrigatório"
            }
        ).email("O e-mail deve ser válido"),
        senha: z.string
        (
            {
                required_error: "Senha é obrigatório"
            }
        ).min(4, "Senha deve conter no mínimo 4 caracteres"),
        ecosaldo: z.number
        (
            {
                invalid_type_error: "O campo Eco Saldo deve conter apenas números"
            }
        ).optional(), 
        cpf: z.string
        (
            {
                required_error: "O campo CPF é obrigatório",
                invalid_type_error: "O campo CPF deve conter apenas números"
            }
        )
        .length(11, "CPF deve conter 11 dígitos")
        .regex(/^\d+$/, "CPF deve conter apenas números"), 
        pais: z.string().min(1, "O campo país é obrigatório"),
        estado: z.string().min(1, "O campo estado é obrigatório"),
        cidade: z.string().min(1, "O campo cidade é obrigatório"),
        cep: z.string
        (
            {
                required_error: "O campo CEP é obrigatório",
                invalid_type_error: "O campo CEP deve conter apenas números"
            }
        )
        .regex(/^\d+$/, "O campo CEP deve conter apenas números"),
        rua: z.string().min(1, "O campo rua é obrigatório"),
        bairro: z.string().min(1, "O campo bairro é obrigatório"),
        numero: z.string().min(1, "O campo número é obrigatório")
    }   
);

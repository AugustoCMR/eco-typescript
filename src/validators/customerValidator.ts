import { z } from 'zod';

export const customerSchema = z.object
(
    {
        id: z.number().optional(),
        codigo: z.number().optional(),
        nome: z.string
        (
            {
                    required_error: "Nome é obrigatório"
            }
        ).min(1, "Nome é obrigatório"),
        email: z.string
        (
            {
                required_error: "E-mail é obrigatório"
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
        pais: z.string
        (
            {
                    required_error: "País é obrigatório"
            }
        ).min(1, "O campo país é obrigatório"),
        estado: z.string
        (
            {
                    required_error: "Estado é obrigatório"
            }
        ).min(1, "O campo estado é obrigatório"),
        cidade: z.string
        (
            {
                    required_error: "Cidade é obrigatório"
            }
        ).min(1, "O campo cidade é obrigatório"),
        cep: z.string
        (
            {
                required_error: "O campo CEP é obrigatório",
                invalid_type_error: "O campo CEP deve conter apenas números"
            }
        )
        .regex(/^\d+$/, "O campo CEP deve conter apenas números"),
        rua: z.string
        (
            {
                    required_error: "Rua é obrigatório"
            }
        ).min(1, "O campo rua é obrigatório"),
        bairro: z.string
        (
            {
                    required_error: "Bairro é obrigatório"
            }
        ).min(1, "O campo bairro é obrigatório"),
        numero: z.string
        (
            {
                    required_error: "País é obrigatório"
            }
        ).min(1, "O campo número é obrigatório")
    }   
);

export type customerSchema = z.infer<typeof customerSchema>;

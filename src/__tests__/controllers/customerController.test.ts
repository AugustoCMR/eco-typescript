import { CustomerService } from '../../service/customerService';
import {customerRepository} from "../../repositories/customerRepository";
import { CodeGenerator } from "../../utils/codeGenerator";
import { generateHash } from "../../utils/hash";
import { customerSchema } from "../../validators/customerValidator";
import {Customer} from "../../models/customerModel";
import {ZodError} from "zod";

jest.mock('../../repositories/customerRepository', () => {
    return {
        customerRepository: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
        },
    };
});
jest.mock('../../utils/codeGenerator');
jest.mock('../../utils/hash');
jest.mock('../../validators/customerValidator');
jest.mock('../../data-source', () => {
    return {
        AppDataSource: {
            initialize: jest.fn(),
            getRepository: jest.fn(),
        },
    };
});

describe('CustomerService', () =>
{
    let customerService: CustomerService;

    beforeEach(() => {
        customerService = new CustomerService();
        jest.clearAllMocks();
    });

    it('Register Successful Customer', async () => {

        const mockCustomer: Customer = {
            nome: 'Augusto',
            email: 'augusto@email.com',
            senha: '1234',
            ecosaldo: 1,
            cpf: '12345678911',
            pais: 'brasil',
            estado: 'bahia',
            cidade: 'salvador',
            cep: '123',
            rua: 'aaa',
            bairro: 'aaaa',
            numero: 'aaa',
        } as Customer;

        const mockValidatedData = {...mockCustomer};
        const mockCode = 12345;
        const mockHashedPassword = 'hashedPassword';

        (customerSchema.parse as jest.Mock).mockReturnValue(mockValidatedData);
        (customerRepository.create as jest.Mock).mockReturnValue(mockValidatedData);
        (customerRepository.save as jest.Mock).mockResolvedValue(mockValidatedData);
        (CodeGenerator.prototype.generateCode as jest.Mock).mockResolvedValue(mockCode);
        (generateHash as jest.Mock).mockResolvedValue(mockHashedPassword);

        await customerService.createCustomer(mockCustomer);

        expect(customerSchema.parse).toHaveBeenCalledWith(mockCustomer);
        expect(CodeGenerator.prototype.generateCode).toHaveBeenCalledWith('customer');
        expect(generateHash).toHaveBeenCalledWith(mockCustomer.senha);
        expect(customerRepository.create).toHaveBeenCalledWith({
            ...mockValidatedData,
            codigo: mockCode,
            senha: mockHashedPassword,
        });

        expect(customerRepository.save).toHaveBeenCalledWith(mockValidatedData);
    });

    it('Register Failed Customer - Email', async () => {
        const mockCustomer: Customer = {
            nome: 'Augusto',
            email: 'invalid-email',
            senha: '1234',
            ecosaldo: 1,
            cpf: '12345678911',
            pais: 'brasil',
            estado: 'bahia',
            cidade: 'salvador',
            cep: '123',
            rua: 'aaa',
            bairro: 'aaaa',
            numero: 'aaa',
        } as Customer;

        const mockValidationError = new ZodError([
            {
                message: 'Invalid email',
                path: ['email'],
                code: 'invalid_type',
                expected: 'string',
                received: 'undefined',
            },
        ]);

        (customerSchema.parse as jest.Mock).mockImplementation(() => {
            throw mockValidationError;
        });

        await expect(customerService.createCustomer(mockCustomer)).rejects.toThrow(mockValidationError);

        expect(customerSchema.parse).toHaveBeenCalledWith(mockCustomer);

        expect(CodeGenerator.prototype.generateCode).not.toHaveBeenCalled();
        expect(generateHash).not.toHaveBeenCalled();
        expect(customerRepository.create).not.toHaveBeenCalled();
        expect(customerRepository.save).not.toHaveBeenCalled();
    });
});





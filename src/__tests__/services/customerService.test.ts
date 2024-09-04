import { CustomerService } from '../../service/customerService';
import {customerRepository} from "../../repositories/customerRepository";
import { CodeGenerator } from "../../utils/codeGenerator";
import { generateHash } from "../../utils/hash";
import { customerSchema } from "../../validators/customerValidator";
import {BadRequestError, NotFoundError} from "../../helpers/api-erros";
import { validateIdParam } from "../../utils/validations";

jest.mock('../../repositories/customerRepository', () => {
    return {
        customerRepository: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn()
        },
    };
});
jest.mock('../../utils/codeGenerator');
jest.mock('../../utils/hash');
jest.mock('../../data-source', () => {
    return {
        AppDataSource: {
            initialize: jest.fn(),
            getRepository: jest.fn(),
        },
    };
});
jest.mock('../../utils/validations');

describe('CustomerService', () =>
{
    let customerService: CustomerService;

    const customerRepositoryCreateMock = customerRepository.create as jest.Mock;
    const customerRepositorySaveMock = customerRepository.save as jest.Mock;
    const CodeGeneratorMock = CodeGenerator.prototype.generateCode as jest.Mock;
    const generateHashMock = generateHash as jest.Mock;
    let validationMock = validateIdParam as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        customerService = new CustomerService();
        customerService.validateCPFAndEmail = jest.fn();
    });

    describe('Create Customer', () => {
        it('Register Successful Customer', async () =>
        {

            const mockCustomer: customerSchema = {
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
            }

            const mockCode = 12345;
            const password = mockCustomer.senha;
            const mockHashedPassword = 'hashedPassword';

            //Arrange
            customerRepositoryCreateMock.mockReturnValue(mockCustomer);
            customerRepositorySaveMock.mockResolvedValue(mockCustomer);
            CodeGeneratorMock.mockReturnValue(mockCode);
            generateHashMock.mockReturnValue(mockHashedPassword);

            //Act
            await customerService.createCustomer(mockCustomer);

            //Assert
            expect(customerService.validateCPFAndEmail).toHaveBeenCalledTimes(1);
            expect(CodeGenerator.prototype.generateCode).toHaveBeenCalledTimes(1);
            expect(generateHash).toHaveBeenCalledTimes(1);
            expect(customerRepository.create).toHaveBeenCalledTimes(1);
            expect(customerRepository.save).toHaveBeenCalledTimes(1);

            expect(CodeGenerator.prototype.generateCode).toHaveBeenCalledWith('customer');
            expect(generateHash).toHaveBeenCalledWith(password);
            expect(customerRepository.create).toHaveBeenCalledWith({
                ...mockCustomer,
                codigo: mockCode,
                senha: mockHashedPassword,
            });
            expect(customerRepository.save).toHaveBeenCalledWith({
                ...mockCustomer,
                codigo: mockCode,
                senha: mockHashedPassword,
            });
        });

        it('Register Failed Customer - CPF already exists', async () =>
        {
            const mockCustomer: customerSchema =
                {
                    nome: 'Augusto',
                    email: 'aaaa',
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
                }

            customerService.validateCPFAndEmail = jest.fn(() => {
                throw new BadRequestError('O CPF informado já possui cadastro');
            });

            await expect(customerService.createCustomer(mockCustomer)).rejects.toThrow(BadRequestError);

            expect(customerService.validateCPFAndEmail).toHaveBeenCalledTimes(1);
            expect(CodeGenerator.prototype.generateCode).not.toHaveBeenCalledTimes(1);
            expect(generateHash).not.toHaveBeenCalledTimes(1);
            expect(customerRepository.create).not.toHaveBeenCalledTimes(1);
            expect(customerRepository.save).not.toHaveBeenCalledTimes(1);
        });

        it('Register Failed Customer - E-mail already exists', async () =>
        {
            const newCustomer: customerSchema =
                {
                    nome: 'Augusto',
                    email: 'augusto@example.com',
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
                }

            const validateCPFAndEmailMock = jest.fn(() => {
                throw new BadRequestError('O E-mail informado já possui cadastro');
            });

            customerService.validateCPFAndEmail = validateCPFAndEmailMock;

            await expect(customerService.createCustomer(newCustomer)).rejects.toThrow(BadRequestError);

            expect(validateCPFAndEmailMock).toHaveBeenCalledTimes(1);
            expect(CodeGenerator.prototype.generateCode).not.toHaveBeenCalledTimes(1);
            expect(generateHash).not.toHaveBeenCalledTimes(1);
            expect(customerRepository.create).not.toHaveBeenCalledTimes(1);
            expect(customerRepository.save).not.toHaveBeenCalledTimes(1);
        });
    });

    describe('Update Customer', () =>
    {
        it('Updated Sucess Customer', async () =>
        {
            const code = 1;
            const mockCustomer: customerSchema =
            {
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
            }

            validationMock.mockReturnValue(mockCustomer);

            await customerService.updateCustomer(code, mockCustomer);

            expect(validationMock).toHaveBeenCalledTimes(1);

            expect(validationMock).toHaveBeenCalledWith(customerRepository, "usuário", code);
            expect(customerRepository.update).toHaveBeenCalledWith(
                {
                    codigo: code
                },
                {
                    ...mockCustomer
                }
            );
        });

        it('Updated Failed Customer - Customer Not Found', async () =>
        {
            const code = 2;
            const mockCustomer: customerSchema =
            {
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
            }

            validationMock = jest.fn(() => {
                throw new NotFoundError("O ID do usuário não foi encontrado");
            })

            await expect(customerService.updateCustomer(code, mockCustomer)).rejects.toThrow(NotFoundError);

            expect(validationMock).toHaveBeenCalledTimes(1);
            expect(customerRepository.update).not.toHaveBeenCalledTimes(1);
        })

    })


});
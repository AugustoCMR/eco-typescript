import { CustomerService } from '../../service/customerService';
import {customerRepository} from "../../repositories/customerRepository";
import { CodeGenerator } from "../../utils/codeGenerator";
import {checkPassword, generateHash} from "../../utils/hash";
import { customerSchema } from "../../validators/customerValidator";
import {BadRequestError, NotFoundError} from "../../helpers/api-erros";
import {validateDelete, validateIdParam} from "../../utils/validations";
import {receivedMaterialRepository} from "../../repositories/receivedMaterialRepository";
import {generateToken} from "../../utils/token";

jest.mock('../../repositories/customerRepository', () => {
    return {
        customerRepository: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        },
    };
});
jest.mock('../../utils/codeGenerator');
jest.mock('../../utils/hash');
jest.mock('../../utils/token')
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
    const customerRepositoryFindMock = customerRepository.findOneBy as jest.Mock;
    const CodeGeneratorMock = CodeGenerator.prototype.generateCode as jest.Mock;
    const generateHashMock = generateHash as jest.Mock;
    const generateTokenMock = generateToken as jest.Mock;
    const checkPasswordMock = checkPassword as jest.Mock;
    let validationIdParamMock = validateIdParam as jest.Mock;
    let validateDeleteMock = validateDelete as jest.Mock;

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

            validationIdParamMock.mockReturnValue(mockCustomer);

            await customerService.updateCustomer(code, mockCustomer);

            expect(validationIdParamMock).toHaveBeenCalledTimes(1);

            expect(validationIdParamMock).toHaveBeenCalledWith(customerRepository, "usuário", code);
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

            validationIdParamMock.mockImplementation(() => {
                throw new NotFoundError(`O ID do usuário não foi encontrado`);
            });

            await expect(customerService.updateCustomer(code, mockCustomer)).rejects.toThrow(NotFoundError);

            expect(validationIdParamMock).toHaveBeenCalledTimes(1);
            expect(customerRepository.update).not.toHaveBeenCalled();
        })

    })

    describe('Delete Customer', () =>
    {
        it('Delete Success Customer', async () =>
        {
            let code = 1;

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

            validationIdParamMock.mockReturnValue(mockCustomer);

            await customerService.deleteCustomer(code);

            expect(validationIdParamMock).toHaveBeenCalledTimes(1);
            expect(validateDeleteMock).toHaveBeenCalledTimes(1);

            expect(validationIdParamMock).toHaveBeenCalledWith(customerRepository, "usuário", code);
            expect(validateDeleteMock).toHaveBeenCalledWith(receivedMaterialRepository, {customer: mockCustomer}, "usuário");
            expect(customerRepository.delete).toHaveBeenCalledWith(
            {
                codigo: code
            });

        })

        it('Delete Failed Customer - Customer Not Found', async () =>
        {
            let code = 2;

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

            validationIdParamMock.mockImplementation(() => {
                throw new NotFoundError(`O ID do usuário não foi encontrado`);
            });

            await expect(customerService.deleteCustomer(code)).rejects.toThrow(NotFoundError);

            expect(validationIdParamMock).toHaveBeenCalledTimes(1);
            expect(validateDeleteMock).not.toHaveBeenCalledTimes(1);
            expect(customerRepository.delete).not.toHaveBeenCalled();
        })

        it('Delete failed Customer - Customer has records ', async () =>
        {
            let code = 2;

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

            validateDeleteMock.mockImplementation(() =>
            {
                throw new BadRequestError('Não é possível deletar um usuário que possui registros.')
            })

            validationIdParamMock.mockReturnValue(mockCustomer);

            await expect(customerService.deleteCustomer(code)).rejects.toThrow(BadRequestError);

            expect(validateDeleteMock).toHaveBeenCalledWith(receivedMaterialRepository, {customer: mockCustomer}, "usuário");
            expect(validationIdParamMock).toHaveBeenCalledTimes(1)
            expect(validationIdParamMock).toHaveBeenCalledWith(customerRepository, "usuário", code);
            expect(customerRepository.delete).not.toHaveBeenCalled();
        })
    })

    describe('Find Customer By ID', () =>
    {
        it('Find Customer By ID Success', async () =>
        {
            let code = 1;

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

            const {senha, ...customer} = mockCustomer;

            validationIdParamMock.mockReturnValue(mockCustomer);

            const result = await customerService.getCustomerById(code);

            expect(validationIdParamMock).toHaveBeenCalledTimes(1);
            expect(validationIdParamMock).toHaveBeenCalledWith(customerRepository, "usuário", code);

            expect(result).toEqual(customer);
        })

        it('Find Customer By ID Failed - Customer not found', async () =>
        {
            let code = 1;

            validationIdParamMock.mockImplementation(() => {
                throw new NotFoundError(`O ID do usuário não foi encontrado`);
            });

            await expect(customerService.getCustomerById(code)).rejects.toThrow(NotFoundError);

            expect(validationIdParamMock).toHaveBeenCalledTimes(1);
            expect(validationIdParamMock).toHaveBeenCalledWith(customerRepository, "usuário", code);
        })
    })

    describe('Login', () =>
    {
        it('Login Customer Success', async() =>
        {
            const mockCustomer: customerSchema =
            {
                id: 1,
                codigo: 2,
                nome: 'Augusto',
                email: 'augusto@email.com',
                senha: 'hashpassword',
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

            const emailCustomer = mockCustomer.email;
            const passwordHash = mockCustomer.senha;

            const email = 'augusto@email.com'
            const password = '1234'

            customerRepositoryFindMock.mockResolvedValue(mockCustomer);
            generateTokenMock.mockResolvedValue('mockToken');

            checkPasswordMock.mockImplementation((password, hash) => {
                return password === '1234' && hash === 'hashpassword';
            });

            const token = await customerService.login(email, password);

            expect(customerRepositoryFindMock).toHaveBeenCalledTimes(1);
            expect(checkPasswordMock).toHaveBeenCalledTimes(1);
            expect(generateTokenMock).toHaveBeenCalledTimes(1);

            expect(customerRepositoryFindMock).toHaveBeenCalledWith({ email: email });
            expect(checkPasswordMock).toHaveBeenCalledWith(password, passwordHash);
            expect(generateTokenMock).toHaveBeenCalledWith({ customerId: mockCustomer.id, email: mockCustomer.email });

            expect(token).toEqual('mockToken');
        })
    })
});
import {CustomerService} from "../../service/customerService";
import {customerRepository} from "../../repositories/customerRepository";
import {generateHash} from "../../utils/hash";
import {CodeGenerator} from "../../utils/codeGenerator";
import {customerSchema} from "../../validators/customerValidator";

jest.mock('../../repositories/customerRepository');
jest.mock('../../utils/hash');
jest.mock('../../utils/codeGenerator');
jest.mock('../../validators/customerValidator');

describe('CustomerService', () =>
{
    let service: CustomerService;

    beforeEach(() =>
    {
        service = new CustomerService();
        jest.clearAllMocks();
    })

    it("Register Successful Customer", async () =>
    {
        const customer =
            {
                "nome": "Augusto",
                "email": "augusto@email.com",
                "senha": "1234",
                "ecosaldo": 1,
                "cpf": "12345678911",
                "pais": "brasil",
                "estado": "bahia",
                "cidade": "salvador",
                "cep": "123",
                "rua": "aaa",
                "bairro": "aaaa",
                "numero": "aaa"
            }

        const validatedCustomer = { ...customer, codigo: 12345, senha: 'hashedPassword' };

        (customerSchema.parse as jest.Mock).mockReturnValue(validatedCustomer);
        (customerService.validateCPFAndEmail as jest.Mock).mockResolvedValue();
        (new CodeGenerator().generateCode as jest.Mock).mockResolvedValue(12345);
        (generateHash as jest.Mock).mockResolvedValue('hashedPassword');
        (customerRepository.create as jest.Mock).mockReturnValue(validatedCustomer);
        (customerRepository.save as jest.Mock).mockImplementation(() => Promise.resolve());

        await customerService.createCustomer(customer);

        expect(customerSchema.parse).toHaveBeenCalledWith(customer);
        expect(customerService.validateCPFAndEmail).toHaveBeenCalledWith(customer.cpf, customer.email);
        expect(CodeGenerator.prototype.generateCode).toHaveBeenCalledWith('customer');
        expect(generateHash).toHaveBeenCalledWith(customer.senha);
        expect(customerRepository.create).toHaveBeenCalledWith(validatedCustomer);
        expect(customerRepository.save).toHaveBeenCalledWith(validatedCustomer);

    })
})




import {validateEntityName} from "../../utils/validations";
import {residueSchema} from "../../validators/residueValidator";
import {ResidueService} from "../../service/residueService";

jest.mock('../../data-source', () => {
    return {
        AppDataSource: {
            initialize: jest.fn(),
            getRepository: jest.fn(),
            query: jest.fn()
        },
    };
});
jest.mock('../../utils/codeGenerator');
jest.mock('../../repositories/residueRepository', () => {
    return {
        residueRepository: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        },
    };
})
jest.mock('../../utils/validations');

describe('ResidueService', () => {

    let residueService: ResidueService;
    const validateEntityNameMock = validateEntityName as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        residueService = new ResidueService();
    })

    it('Create Residue Success', async () =>
    {
       const residueMock: residueSchema =
       {
           nome: "Metal"
       }

        await residueService.createResidue(residueMock);

        expect(validateEntityNameMock).toHaveBeenCalledTimes(1);
    })
})
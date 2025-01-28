import { Test, TestingModule } from '@nestjs/testing';
import { IRolesService, RolesService } from '../roles.service';
import { Role } from '../../roles.interface';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('RolesService', () => {
  let service: IRolesService;
  const role1 = new Role();
  role1.id = 'fe23342ff';
  role1.name = 'role1';
  const role2 = new Role();
  role2.id = 'ferge342';
  role2.name = 'role2';
  const role3 = new Role();
  role3.id = 'fere22';
  role3.name = 'role2';
  const roles = [role1, role2, role3];
  const mockRolesRepository = {
    insert: jest.fn().mockImplementation((payload) => {
      const role = new Role();
      role.id = 'fe23342ff';
      role.name = payload.name;
      return role;
    }),
    findMany: jest.fn().mockImplementation(() => {
      return roles;
    }),
    count: jest.fn().mockImplementation(() => {
      return roles.length;
    }),
    findOneById: jest.fn().mockImplementation((id) => {
      const result = roles.find((item) => item.id === id);
      return result;
    }),
    findOne: jest.fn().mockImplementation((options) => {
      const result = roles.find((item) => item.id === options.filter._id);
      return result;
    }),
    softDelete: jest.fn().mockImplementation((options) => {
      return roles.reduce((numFound: number, item: Role) => {
        if (item.id === options.filter._id) {
          numFound += 1;
        }
        return numFound;
      }, 0);
    }),
    update: jest.fn().mockImplementation((options) => {
      return roles.reduce((numFound: number, item: Role) => {
        if (item.id === options.filter._id) {
          numFound += 1;
        }
        return numFound;
      }, 0);
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesService],
      providers: [
        { provide: 'ROLES_REPOSITORY', useValue: mockRolesRepository },
        ...paginatorProviders,
      ],
    }).compile();

    service = app.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create role', () => {
    it('should return the created role', async () => {
      const createPayload = {
        name: 'newrole',
      };
      const result = await service.create(createPayload);
      expect(result).toEqual(expect.any(Object));
      expect(result).toBeInstanceOf(Role);
      expect(result.name).toEqual(createPayload.name);
    });

    it('should execute roles repo insert method', () => {
      expect(mockRolesRepository.insert).toHaveBeenCalled();
    });
  });
  describe('get all roles', () => {
    it('should return a paginated result with a payload that is a list of roles', async () => {
      const getOptions = {};
      const result = await service.getAll(getOptions);
      expect(result).toEqual(expect.any(Object));
      result.payload.forEach((item) => expect(item).toBeInstanceOf(Role));
    });

    it('should execute roles repo findMany method', () => {
      expect(mockRolesRepository.findMany).toHaveBeenCalled();
    });
    it('should execute roles repo findMany method', () => {
      expect(mockRolesRepository.count).toHaveBeenCalled();
    });
  });
  describe('get role by id', () => {
    it('should return a role when given a correct id', async () => {
      const roleId = 'fere22';
      const result = await service.getOneById(roleId);
      expect(result).toEqual(expect.any(Object));
      expect(result).toBeInstanceOf(Role);
    });
    it('should return undefined when no role was found with the given id', async () => {
      const roleId = 'ferefe22';
      const result = await service.getOneById(roleId);
      expect(result).toEqual(undefined);
    });
    it('should execute roles repo findMany method', () => {
      expect(mockRolesRepository.findOneById).toHaveBeenCalled();
    });
  });
  describe('get one role', () => {
    it('should return a role when given a correct id', async () => {
      const options = {
        filter: {
          _id: 'fere22',
        },
      };
      const result = await service.getOne(options);
      expect(result).toEqual(expect.any(Object));
      expect(result).toBeInstanceOf(Role);
    });
    it('should return undefined when no role was found with the given id', async () => {
      const options = {
        filter: {
          _id: 'ferefe22',
        },
      };
      const result = await service.getOne(options);
      expect(result).toEqual(undefined);
    });
    it('should execute roles repo findMany method', () => {
      expect(mockRolesRepository.findOne).toHaveBeenCalled();
    });
  });
  describe('delete role', () => {
    it('should return 1 when given a correct id', async () => {
      const options = {
        filter: {
          _id: 'fere22',
        },
      };
      const result = await service.softDeleteOne(options);
      expect(result).toEqual(expect.any(Number));
      expect(result).toEqual(1);
    });
    it('should return 0 when given a none existant id', async () => {
      const options = {
        filter: {
          _id: 'ferefe22',
        },
      };
      const result = await service.softDeleteOne(options);
      expect(result).toEqual(expect.any(Number));
      expect(result).toEqual(0);
    });
    it('should execute roles repo update method', () => {
      expect(mockRolesRepository.softDelete).toHaveBeenCalled();
    });
  });
  describe('update role', () => {
    it('should return 1 when given a correct id', async () => {
      const updatePayload = {
        name: 'newRoleName',
      };
      const options = {
        filter: {
          _id: 'fere22',
        },
      };
      const result = await service.update(options, updatePayload);
      expect(result).toEqual(expect.any(Number));
      expect(result).toEqual(1);
    });
    it('should return 0 when given a none existant id', async () => {
      const updatePayload = {
        name: 'newRoleName',
      };
      const options = {
        filter: {
          _id: 'ferefe22',
        },
      };
      const result = await service.update(options, updatePayload);
      expect(result).toEqual(expect.any(Number));
      expect(result).toEqual(0);
    });
    it('should execute roles repo update method', () => {
      expect(mockRolesRepository.update).toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { IPermissionsService, PermissionsService } from '../permissions.service';
import { Permission } from '../../permissions.interface';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('PermissionsService', () => {
  let service: IPermissionsService;
  const permission1 = new Permission();
  permission1.id = 'fe23342ff';
  permission1.name = 'permission1';
  const permission2 = new Permission();
  permission2.id = 'ferge342';
  permission2.name = 'permission2';
  const permission3 = new Permission();
  permission3.id = 'fere22';
  permission3.name = 'permission3';
  const permissions = [permission1, permission2, permission3];
  const mockPermissionsRepository = {
    insert: jest.fn().mockImplementation((payload) => {
      const permission = new Permission();
      permission.id = 'fe23342ff';
      permission.name = payload.name;
      return permission;
    }),
    findMany: jest.fn().mockImplementation(() => {
      return permissions;
    }),
    count: jest.fn().mockImplementation(() => {
      return permissions.length;
    }),
    findOneById: jest.fn().mockImplementation((id) => {
      const result = permissions.find((item) => item.id === id);
      return result;
    }),
    findOne: jest.fn().mockImplementation((options) => {
      const result = permissions.find((item) => item.id === options.filter._id);
      return result;
    }),
    softDelete: jest.fn().mockImplementation((options) => {
      return permissions.reduce((numFound: number, item: Permission) => {
        if (item.id === options.filter._id) {
          numFound += 1;
        }
        return numFound;
      }, 0);
    }),
    update: jest.fn().mockImplementation((options) => {
      return permissions.reduce((numFound: number, item: Permission) => {
        if (item.id === options.filter._id) {
          numFound += 1;
        }
        return numFound;
      }, 0);
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsService],
      providers: [
        { provide: 'PERMISSIONS_REPOSITORY', useValue: mockPermissionsRepository },
        ...paginatorProviders,
      ],
    }).compile();

    service = app.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create permission', () => {
    it('should return the created permission', async () => {
      const createPayload = {
        name: 'newPermission',
      };
      const result = await service.create(createPayload);
      expect(result).toEqual(expect.any(Object));
      expect(result).toBeInstanceOf(Permission);
      expect(result.name).toEqual(createPayload.name);
    });

    it('should execute permissions repo insert method', () => {
      expect(mockPermissionsRepository.insert).toHaveBeenCalled();
    });
  });
  describe('get all permissions', () => {
    it('should return a paginated result with a payload that is a list of permissions', async () => {
      const getOptions = {};
      const result = await service.getAll(getOptions);
      expect(result).toEqual(expect.any(Object));
      result.payload.forEach((item) => expect(item).toBeInstanceOf(Permission));
    });

    it('should execute permissions repo findMany method', () => {
      expect(mockPermissionsRepository.findMany).toHaveBeenCalled();
    });
    it('should execute permissions repo findMany method', () => {
      expect(mockPermissionsRepository.count).toHaveBeenCalled();
    });
  });
  describe('get permissions by id', () => {
    it('should return a permission when given a correct id', async () => {
      const permissionId = 'fere22';
      const result = await service.getOneById(permissionId);
      expect(result).toEqual(expect.any(Object));
      expect(result).toBeInstanceOf(Permission);
    });
    it('should return undefined when no permission was found with the given id', async () => {
      const permissionId = 'ferefe22';
      const result = await service.getOneById(permissionId);
      expect(result).toEqual(undefined);
    });
    it('should execute permissions repo findMany method', () => {
      expect(mockPermissionsRepository.findOneById).toHaveBeenCalled();
    });
  });
  describe('get one permission', () => {
    it('should return a permission when given a correct id', async () => {
      const options = {
        filter: {
          _id: 'fere22',
        },
      };
      const result = await service.getOne(options);
      expect(result).toEqual(expect.any(Object));
      expect(result).toBeInstanceOf(Permission);
    });
    it('should return undefined when no permission was found with the given id', async () => {
      const options = {
        filter: {
          _id: 'ferefe22',
        },
      };
      const result = await service.getOne(options);
      expect(result).toEqual(undefined);
    });
    it('should execute permissions repo findMany method', () => {
      expect(mockPermissionsRepository.findOne).toHaveBeenCalled();
    });
  });
  describe('delete permissions', () => {
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
    it('should execute permissions repo update method', () => {
      expect(mockPermissionsRepository.softDelete).toHaveBeenCalled();
    });
  });
  describe('update permission', () => {
    it('should return 1 when given a correct id', async () => {
      const updatePayload = {
        name: 'newPermissionName',
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
        name: 'newPermissionName',
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
    it('should execute permissions repo update method', () => {
      expect(mockPermissionsRepository.update).toHaveBeenCalled();
    });
  });
});

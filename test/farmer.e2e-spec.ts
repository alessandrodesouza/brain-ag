import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Chance } from 'chance';
import { Farmer } from '../src/model/farmer';
import { FarmerRepository } from '../src/infra/db/farmerRepository';
import { FarmRepository } from '../src/infra/db/farmRepository';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

jest.mock('../src/prisma.service');
jest.mocked(PrismaService);

describe('Farmer Controller (e2e)', () => {
  let app: INestApplication;

  const c = Chance.Chance();
  const farmer = Farmer.parse({
    id: c.guid({ version: 4 }),
    name: c.name({ middle: true }),
    document: '29205732095',
  });

  let farmerRepository: FarmerRepository;
  let farmRepository: FarmRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    farmerRepository = moduleFixture.get(FarmerRepository);
    farmRepository = moduleFixture.get(FarmRepository);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('/farmer/ (GET): ok', () => {
    const farmers: any = [
      {
        id: '3d19561d-580f-4486-90c1-c7722e344f9e',
        document: '78414937039',
        name: 'Alessandro de Souza',
        createdAt: '2024-12-17T19:03:35.375Z',
        updatedAt: '2024-12-18T13:35:28.837Z',
      },
      {
        id: 'f8f3055e-3351-44bb-836c-d3260510fa8c',
        document: '71069667000199',
        name: 'Fazendeiro SA',
        createdAt: '2024-12-18T13:53:31.783Z',
        updatedAt: '2024-12-18T13:53:31.783Z',
      },
    ];

    jest.spyOn(farmerRepository, 'getFarmers').mockResolvedValueOnce(farmers);

    return request(app.getHttpServer())
      .get('/farmer/')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(farmers);
      });
  });

  it('/farmer/:idOrDocument (GET): ok', () => {
    jest.spyOn(farmerRepository, 'getFarmerById').mockResolvedValueOnce(farmer);

    return request(app.getHttpServer())
      .get(`/farmer/${farmer.id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(farmer.toJSON());
      });
  });

  it('/farmer/:idOrDocument (GET): not found', () => {
    jest
      .spyOn(farmerRepository, 'getFarmerById')
      .mockResolvedValueOnce(undefined);

    jest
      .spyOn(farmerRepository, 'getFarmerByDocument')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer()).get(`/farmer/${farmer.id}`).expect(404);
  });

  it('/farmer/ (POST): ok', () => {
    const id = c.guid({ version: 4 });
    jest
      .spyOn(farmerRepository, 'getFarmerByDocument')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(farmerRepository, 'createFarmer').mockResolvedValueOnce(id);

    return request(app.getHttpServer())
      .post('/farmer/')
      .send({ document: farmer.document, name: farmer.name })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBe(id);
      });
  });

  it('/farmer/ (POST): bad request', () => {
    const id = c.guid({ version: 4 });
    jest
      .spyOn(farmerRepository, 'getFarmerByDocument')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(farmerRepository, 'createFarmer').mockResolvedValueOnce(id);

    return request(app.getHttpServer())
      .post('/farmer/')
      .send({ document: '31544514124', name: 123 })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('farmer.invalid.name');
      });
  });

  it('/farmer/ (POST): duplicated document', () => {
    jest
      .spyOn(farmerRepository, 'getFarmerByDocument')
      .mockResolvedValueOnce(farmer);

    return request(app.getHttpServer())
      .post('/farmer/')
      .send({ document: farmer.document, name: farmer.name })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('farmer.duplicate.document');
      });
  });

  it('/farmer/:id (PATCH): ok', () => {
    const id = c.guid({ version: 4 });
    jest.spyOn(farmerRepository, 'getFarmerById').mockResolvedValueOnce(farmer);
    jest
      .spyOn(farmerRepository, 'getOtherFarmerByDocument')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(farmerRepository, 'createFarmer').mockResolvedValueOnce(id);
    jest
      .spyOn(farmerRepository, 'updateFarmer')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .patch(`/farmer/${farmer.id}`)
      .send({ name: 'Nome alterado' })
      .expect(200);
  });

  it('/farmer/:id (PATCH): not found', () => {
    jest
      .spyOn(farmerRepository, 'getFarmerById')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .patch(`/farmer/${farmer.id}`)
      .send({ name: 'Nome alterado' })
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('farmer.not.found');
      });
  });

  it('/farmer/:id (DELETE): ok', () => {
    jest.spyOn(farmerRepository, 'getFarmerById').mockResolvedValueOnce(farmer);
    jest
      .spyOn(farmRepository, 'getTotalFarmsByFarmerId')
      .mockResolvedValueOnce(0);
    jest
      .spyOn(farmerRepository, 'deleteFarmerById')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .delete(`/farmer/${farmer.id}`)
      .expect(200);
  });

  it('/farmer/:id (DELETE): not found', () => {
    jest
      .spyOn(farmerRepository, 'getFarmerById')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .delete(`/farmer/${farmer.id}`)
      .expect(404);
  });

  it('/farmer/:id (DELETE): there are farms', () => {
    jest.spyOn(farmerRepository, 'getFarmerById').mockResolvedValueOnce(farmer);
    jest
      .spyOn(farmRepository, 'getTotalFarmsByFarmerId')
      .mockResolvedValueOnce(3);

    return request(app.getHttpServer())
      .delete(`/farmer/${farmer.id}`)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('there.are.farms.for.this.farmer');
      });
  });
});

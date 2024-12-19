import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Chance } from 'chance';
import { Farmer } from '../src/model/farmer';
import { FarmerRepository } from '../src/infra/db/farmerRepository';
import { FarmRepository } from '../src/infra/db/farmRepository';
import { AppModule } from '../src/app.module';
import { CropTypeEnum, Farm } from '../src/model/farm';
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

  const farm = Farm.parse({
    id: c.guid({ version: 4 }),
    name: 'Fazenda Terra Nossa',
    city: 'Mogi Guaçu',
    state: 'sp',
    totalArea: 10000,
    vegetationArea: 5000,
    farmer,
    crops: [
      {
        type: CropTypeEnum.Soy,
        totalArea: 1000,
      },
      {
        type: CropTypeEnum.Corn,
        totalArea: 2000,
      },
    ],
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

  it('/farm/ (GET): ok', () => {
    const farms: any = [
      {
        id: 'b7552e87-7b8c-4deb-a5b6-45621b2d373e',
        name: 'Fazenda Terra Nossa',
        city: 'MOGI GUAÇU',
        state: 'SP',
        totalArea: 10000,
        cultivableArea: 3000,
        vegetationArea: 5000,
        farmer: {
          id: '3d19561d-580f-4486-90c1-c7722e344f9e',
          document: '78414937039',
          name: 'Alessandro de Souza',
          createdAt: '2024-12-17T19:03:35.375Z',
          updatedAt: '2024-12-18T13:35:28.837Z',
        },
        crops: [
          {
            type: 'soy',
            totalArea: 1000,
          },
          {
            type: 'corn',
            totalArea: 2000,
          },
        ],
        createdAt: '2024-12-18T18:01:10.436Z',
        updatedAt: '2024-12-18T18:01:10.436Z',
      },
      {
        id: 'f4be29ce-009e-43b1-9e17-bae0ca49e512',
        name: 'Sítio Amanhecer de Manhã',
        city: 'MOGI MIRIM',
        state: 'SP',
        totalArea: 3525,
        cultivableArea: 1160,
        vegetationArea: 1200,
        farmer: {
          id: 'f8f3055e-3351-44bb-836c-d3260510fa8c',
          document: '71069667000199',
          name: 'Fazendeiro SA',
          createdAt: '2024-12-18T13:53:31.783Z',
          updatedAt: '2024-12-18T13:53:31.783Z',
        },
        crops: [
          {
            type: 'soy',
            totalArea: 535,
          },
          {
            type: 'corn',
            totalArea: 625,
          },
        ],
        createdAt: '2024-12-19T15:06:27.317Z',
        updatedAt: '2024-12-19T15:06:27.317Z',
      },
    ];

    jest.spyOn(farmRepository, 'getFarms').mockResolvedValueOnce(farms);

    return request(app.getHttpServer())
      .get('/farm/')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(farms);
      });
  });

  it('/farm/:id (GET): ok', () => {
    jest.spyOn(farmRepository, 'getFarmById').mockResolvedValueOnce(farm);

    return request(app.getHttpServer())
      .get(`/farm/${farm.id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(farm.toJSON());
      });
  });

  it('/farm/:id (GET): not found', () => {
    jest.spyOn(farmRepository, 'getFarmById').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer()).get(`/farm/${farmer.id}`).expect(404);
  });

  it('/farm/ (POST): ok', () => {
    const id = c.guid({ version: 4 });
    jest.spyOn(farmerRepository, 'getFarmerById').mockResolvedValueOnce(farmer);
    jest.spyOn(farmRepository, 'createFarm').mockResolvedValueOnce(id);

    return request(app.getHttpServer())
      .post('/farm/')
      .send({
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        vegetationArea: farm.vegetationArea,
        farmerId: farmer.id,
        crops: farm.crops,
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBe(id);
      });
  });

  it('/farm/ (POST): farmer not fount', () => {
    jest
      .spyOn(farmerRepository, 'getFarmerById')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/farm/')
      .send({
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        vegetationArea: farm.vegetationArea,
        farmerId: farmer.id,
        crops: farm.crops,
      })
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('farmer.not.found');
      });
  });

  it('/farm/ (POST): bad request', () => {
    jest.spyOn(farmerRepository, 'getFarmerById').mockResolvedValueOnce(farmer);

    return request(app.getHttpServer())
      .post('/farm/')
      .send({
        name: '',
        city: '',
        state: '',
        totalArea: -10000,
        vegetationArea: -25455,
        farmerId: {},
        crops: [],
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('farm.invalid.name');
      });
  });

  it('/farm/:id (PATCH): ok', () => {
    jest.spyOn(farmRepository, 'getFarmById').mockResolvedValueOnce(farm);
    jest.spyOn(farmRepository, 'updateFarm').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .patch(`/farm/${farm.id}`)
      .send({ name: 'Nome alterado' })
      .expect(200);
  });

  it('/farm/:id (PATCH): not found', () => {
    jest.spyOn(farmRepository, 'getFarmById').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .patch(`/farm/${farm.id}`)
      .send({ name: 'Nome alterado' })
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('farm.not.found');
      });
  });

  it('/farm/:id (DELETE): ok', () => {
    jest.spyOn(farmRepository, 'getFarmById').mockResolvedValueOnce(farm);
    jest
      .spyOn(farmRepository, 'deleteFarmById')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer()).delete(`/farm/${farm.id}`).expect(200);
  });

  it('/farm/:id (DELETE): not found', () => {
    jest.spyOn(farmRepository, 'getFarmById').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .delete(`/farm/${farm.id}`)
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('farm.not.found');
      });
  });

  it('/farm/dashboard/totalizers (GET): ok', () => {
    const totalizer = {
      numberOfFarms: 2,
      totalArea: 13525,
      totalCultivableArea: 4160,
      totalVegetationArea: 6200,
      totalCultivableAreaByState: {
        SP: 4160,
      },
      totalCultivableAreaByCrop: {
        soy: 1000,
        corn: 2625,
        cofee: 535,
      },
    };

    jest
      .spyOn(farmRepository, 'getTotalizers')
      .mockResolvedValueOnce(totalizer);

    return request(app.getHttpServer())
      .get('/farm/dashboard/totalizers')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(totalizer);
      });
  });
});

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const farmerId1 = 'b7bd191c-6e93-4029-9d42-15be407cb8e9';
  const farmer1 = await prisma.farmer.findUnique({ where: { id: farmerId1 } });
  if (!farmer1) {
    await prisma.farmer.create({
      data: {
        id: farmerId1,
        name: 'Antonio Juazeiro da Silva',
        document: '39119901038',
      },
    });
  }

  const farmerId2 = 'd50fc2b1-e672-421a-a148-530e90cf1bfc';
  const farmer2 = await prisma.farmer.findUnique({ where: { id: farmerId2 } });
  if (!farmer2) {
    await prisma.farmer.create({
      data: {
        id: farmerId2,
        name: 'Pedro dos Santos Sitiante',
        document: '05520212023',
      },
    });
  }

  const farmId1 = '28123b41-dae9-4b44-80d8-6bf53d00219b';
  const farm1 = await prisma.farm.findUnique({ where: { id: farmId1 } });
  if (!farm1) {
    await prisma.farm.create({
      data: {
        id: farmId1,
        name: 'Fazenda Terra Nossa',
        city: 'MOGI GUAÇU',
        state: 'SP',
        totalArea: 10000,
        cultivableArea: 3000,
        vegetationArea: 5000,
        farmerId: farmerId1,
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
      },
    });
  }

  const farmId2 = 'b1526e64-4228-424c-a299-bcfe54b53f04';
  const farm2 = await prisma.farm.findUnique({ where: { id: farmId2 } });
  if (!farm2) {
    await prisma.farm.create({
      data: {
        id: farmId2,
        name: 'Sítio Morro Alto',
        city: 'OURO FINO',
        state: 'MG',
        totalArea: 1500,
        cultivableArea: 700,
        vegetationArea: 500,
        farmerId: farmerId1,
        crops: [
          {
            type: 'soy',
            totalArea: 400,
          },
          {
            type: 'coffee',
            totalArea: 300,
          },
        ],
      },
    });
  }

  const farmId3 = 'ae7d079b-0ecc-4c3d-af70-bbace59c6371';
  const farm3 = await prisma.farm.findUnique({ where: { id: farmId3 } });
  if (!farm3) {
    await prisma.farm.create({
      data: {
        id: farmId3,
        name: 'Fazenda Fazendinha Grande',
        city: 'CAMPINAS',
        state: 'SP',
        totalArea: 3500,
        cultivableArea: 1200,
        vegetationArea: 500,
        farmerId: farmerId2,
        crops: [
          {
            type: 'soy',
            totalArea: 400,
          },
          {
            type: 'coffee',
            totalArea: 300,
          },
          {
            type: 'corn',
            totalArea: 500,
          },
        ],
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

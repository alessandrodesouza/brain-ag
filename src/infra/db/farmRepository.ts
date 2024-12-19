import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Crop, Farm } from '../../model/farm';
import { IFarmRepository } from '../../model/repositories/farmRepository';
import { PrismaService } from '../../prisma.service';
import { FarmTotalizers, FarmDetails } from 'src/model/readModel/farm';

@Injectable()
export class FarmRepository implements IFarmRepository {
  constructor(private prisma: PrismaService) {}

  async createFarm(farm: Farm): Promise<string> {
    const cropArrayObject = farm.crops as Prisma.JsonArray;

    const newFarm = await this.prisma.farm.create({
      data: {
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        cultivableArea: farm.cultivableArea,
        vegetationArea: farm.vegetationArea,
        farmer: {
          connect: { id: farm.farmer.id },
        },
        crops: cropArrayObject,
      },
    });

    return newFarm.id;
  }

  async updateFarm(farm: Farm): Promise<void> {
    await this.prisma.farm.update({
      where: { id: farm.id },
      data: {
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        cultivableArea: farm.cultivableArea,
        vegetationArea: farm.vegetationArea,
        farmer: {
          connect: { id: farm.farmer.id },
        },
        crops: farm.crops,
      },
    });
  }

  async getFarmById(id: string): Promise<Farm> {
    const resultFarm = await this.prisma.farm.findUnique({
      where: {
        id,
      },
    });
    if (!resultFarm) return undefined;

    const resultFarmer = await this.prisma.farmer.findUnique({
      where: {
        id: resultFarm.farmerId,
      },
    });
    if (!resultFarmer) {
      throw new Error(`Saved farmer ${resultFarm.farmerId} not found`);
    }

    const farmer = Farm.parse({
      ...resultFarm,
      farmer: resultFarmer,
      crops: resultFarm.crops as any,
    });

    return farmer;
  }

  async getTotalFarmsByFarmerId(farmerId: string): Promise<number> {
    const farms = await this.prisma.farm.findMany({
      where: {
        farmerId,
      },
    });

    return farms.length;
  }

  async deleteFarmById(id: string): Promise<void> {
    await this.prisma.farm.delete({
      where: {
        id,
      },
    });
  }

  async getFarms(farmerId?: string): Promise<FarmDetails[]> {
    const whereObject = farmerId ? { farmerId } : {};
    const farms: any = await this.prisma.farm.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        totalArea: true,
        cultivableArea: true,
        vegetationArea: true,
        farmerId: false,
        farmer: true,
        crops: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereObject,
      orderBy: {
        name: 'asc',
      },
    });

    return farms;
  }

  async getTotalizers(): Promise<FarmTotalizers> {
    const farms = await this.prisma.farm.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const totalizer = {
      numberOfFarms: 0,
      totalArea: 0,
      totalCultivableArea: 0,
      totalVegetationArea: 0,
      totalCultivableAreaByState: {},
      totalCultivableAreaByCrop: {},
    };

    farms.reduce((t, farm) => {
      t.numberOfFarms += 1;
      t.totalArea += farm.totalArea;
      t.totalCultivableArea += farm.cultivableArea;
      t.totalVegetationArea += farm.vegetationArea;

      t.totalCultivableAreaByState[farm.state] = t.totalCultivableAreaByState[
        farm.state
      ]
        ? t.totalCultivableAreaByState[farm.state] + farm.cultivableArea
        : farm.cultivableArea;

      (farm.crops as any).forEach((c: Crop) => {
        t.totalCultivableAreaByCrop[c.type] = t.totalCultivableAreaByCrop[
          c.type
        ]
          ? t.totalCultivableAreaByCrop[c.type] + c.totalArea
          : c.totalArea;
      });

      return t;
    }, totalizer);

    return totalizer;
  }
}

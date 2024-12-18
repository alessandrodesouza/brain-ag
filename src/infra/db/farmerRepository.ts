import { Injectable } from '@nestjs/common';
import { Farmer } from 'src/model/farmer';
import { IFarmerRepository } from 'src/model/repositories/farmerRepository';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FarmerRepository implements IFarmerRepository {
  constructor(private prisma: PrismaService) {}

  async createFarmer(farmer: Farmer): Promise<string> {
    const newFarmer = await this.prisma.farmer.create({
      data: {
        document: farmer.document,
        name: farmer.name,
      },
    });

    return newFarmer.id;
  }

  async updateFarmer(farmer: Farmer): Promise<void> {
    await this.prisma.farmer.update({
      where: { id: farmer.id },
      data: {
        document: farmer.document,
        name: farmer.name,
      },
    });
  }

  async getFarmerById(id: string): Promise<Farmer> {
    const result = await this.prisma.farmer.findUnique({
      where: {
        id,
      },
    });

    if (!result) return undefined;

    const farmer = Farmer.parse(result);
    return farmer;
  }

  async getFarmerByDocument(document: string): Promise<Farmer> {
    const result = await this.prisma.farmer.findUnique({
      where: {
        document,
      },
    });

    if (!result) return undefined;

    const farmer = Farmer.parse(result);
    return farmer;
  }

  async getOtherFarmerByDocument(
    id: string,
    document: string,
  ): Promise<Farmer> {
    const result = await this.prisma.farmer.findFirst({
      where: {
        document,
        id: { not: id },
      },
    });

    if (!result) return undefined;

    const farmer = Farmer.parse(result);
    return farmer;
  }

  async deleteFarmerById(id: string): Promise<void> {
    await this.prisma.farmer.delete({
      where: {
        id,
      },
    });
  }
}

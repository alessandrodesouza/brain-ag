import { Injectable } from '@nestjs/common';
import { FarmerRepository } from '../infra/db/farmerRepository';
import { FarmRepository } from '../infra/db/farmRepository';
import { FarmerNotFoundError } from '../model/errors/farmerNotFoundError';
import { FarmNotFoundError } from '../model/errors/farmNotFoundError';
import { Crop, Farm } from '../model/farm';
import { Farmer } from '../model/farmer';
import { FarmDetails, FarmTotalizers } from '../model/readModel/farm';

export type CreateFarmParams = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  vegetationArea: number;
  farmerId: string;
  crops: Crop[];
};

export type UpdateFarmParams = Partial<CreateFarmParams> & {
  id: string;
};

@Injectable()
export class FarmService {
  constructor(
    private farmerRepository: FarmerRepository,
    private farmRepository: FarmRepository,
  ) {}

  async createFarm(params: CreateFarmParams): Promise<string> {
    const farmer = await this.farmerRepository.getFarmerById(params.farmerId);
    if (!farmer) {
      throw new FarmerNotFoundError({});
    }

    const newFarm = Farm.create({
      name: params.name,
      city: params.city,
      state: params.state,
      totalArea: params.totalArea,
      vegetationArea: params.vegetationArea,
      farmer,
      crops: params.crops,
    });

    const id = await this.farmRepository.createFarm(newFarm);
    return id;
  }

  async updateFarm(params: UpdateFarmParams): Promise<void> {
    const farm = await this.farmRepository.getFarmById(params.id);
    if (!farm) {
      throw new FarmNotFoundError({});
    }

    let farmer: Farmer;
    if (params.farmerId) {
      farmer = await this.farmerRepository.getFarmerById(params.farmerId);
      if (!farmer) {
        throw new FarmerNotFoundError({});
      }
    }

    farm.update({ ...params, farmer });

    await this.farmRepository.updateFarm(farm);
  }

  async getFarm({ id }: { id: string }): Promise<Farm> {
    const farmById = await this.farmRepository.getFarmById(id);
    if (farmById) return farmById;

    return undefined;
  }

  async getFarms(farmerId?: string): Promise<FarmDetails[]> {
    const farms = await this.farmRepository.getFarms(farmerId);
    return farms;
  }

  async deleteFarm({ id }: { id: string }): Promise<void> {
    const farm = await this.farmRepository.getFarmById(id);
    if (!farm) {
      throw new FarmNotFoundError({});
    }

    await this.farmRepository.deleteFarmById(id);
  }

  async getTotalizers(): Promise<FarmTotalizers> {
    const totalizers = await this.farmRepository.getTotalizers();
    return totalizers;
  }
}

import { Crop } from '../farm';
import { FarmerDetails } from './farmer';

export interface FarmDetails {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  cultivableArea: number;
  vegetationArea: number;
  farmer: FarmerDetails;
  crops: Crop[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FarmTotalizers {
  numberOfFarms: number;
  totalArea: number;
  totalCultivableArea: number;
  totalVegetationArea: number;
  totalCultivableAreaByState: Record<string, number>;
  totalCultivableAreaByCrop: Record<string, number>;
}

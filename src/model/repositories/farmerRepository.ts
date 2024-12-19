import { Farmer } from '../farmer';
import { FarmerDetails } from '../readModel/farmer';

export interface IFarmerRepository {
  createFarmer(farmer: Farmer): Promise<string>;
  updateFarmer(farmer: Farmer): Promise<void>;
  getFarmers(): Promise<FarmerDetails[]>;
  getFarmerById(id: string): Promise<Farmer>;
  getFarmerByDocument(document: string): Promise<Farmer>;
  getOtherFarmerByDocument(id: string, document: string): Promise<Farmer>;
  deleteFarmerById(id: string): Promise<void>;
}

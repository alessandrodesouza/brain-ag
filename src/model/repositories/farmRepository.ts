import { Farmer } from '../farmer';

export interface IFarmRepository {
  createFarmer(farm: Farmer): Promise<string>;
  updateFarmer(farm: Farmer): Promise<void>;
  getFarmerById(id: string): Promise<Farmer>;
  getFarmerByDocument(document: string): Promise<Farmer>;
  getOtherFarmerByDocument(id: string, document: string): Promise<Farmer>;
  deleteFarmerById(id: string): Promise<void>;
}

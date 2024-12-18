import { Farm } from '../farm';

export interface IFarmRepository {
  createFarm(farm: Farm): Promise<string>;
  getFarmById(id: string): Promise<Farm>;
  getTotalFarmsByFarmerId(farmerId: string): Promise<number>;
  deleteFarmById(id: string): Promise<void>;
}

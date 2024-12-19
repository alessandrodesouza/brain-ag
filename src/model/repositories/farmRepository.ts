import { Farm } from '../farm';
import { FarmDetails } from '../readModel/farm';

export interface IFarmRepository {
  createFarm(farm: Farm): Promise<string>;
  getFarmById(id: string): Promise<Farm>;
  getFarms(farmerId?: string): Promise<FarmDetails[]>;
  getTotalFarmsByFarmerId(farmerId: string): Promise<number>;
  deleteFarmById(id: string): Promise<void>;
}

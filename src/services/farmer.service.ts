import { Injectable } from '@nestjs/common';
import { FarmerRepository } from '../infra/db/farmerRepository';
import { FarmRepository } from '../infra/db/farmRepository';
import { FarmerDeleteError } from '../model/errors/farmerDeleteError';
import { FarmerDuplicateDocumentError } from '../model/errors/farmerDuplicateDocumentError';
import { FarmerNotFoundError } from '../model/errors/farmerNotFoundError';
import { Farmer } from '../model/farmer';
import { ValidateDuplicateDocument } from '../model/validateDuplicatedDocument';

@Injectable()
export class FarmerService {
  constructor(
    private validateDuplicateDocument: ValidateDuplicateDocument,
    private farmerRepository: FarmerRepository,
    private farmRepository: FarmRepository,
  ) {}

  async createFarmer({
    document,
    name,
  }: {
    document: string;
    name: string;
  }): Promise<string> {
    const newFarmer = Farmer.create({ document, name });

    const isDuplicated = await this.validateDuplicateDocument.validate(
      newFarmer.document,
    );
    if (isDuplicated) {
      throw new FarmerDuplicateDocumentError({});
    }

    const id = await this.farmerRepository.createFarmer(newFarmer);
    return id;
  }

  async updateFarmer({
    id,
    document,
    name,
  }: {
    id: string;
    document: string;
    name: string;
  }): Promise<void> {
    const farmer = await this.farmerRepository.getFarmerById(id);
    if (!farmer) {
      throw new FarmerNotFoundError({});
    }

    farmer.update({ document, name });

    const isDuplicated = await this.validateDuplicateDocument.validateOther(
      id,
      farmer.document,
    );
    if (isDuplicated) {
      throw new FarmerDuplicateDocumentError({});
    }

    await this.farmerRepository.updateFarmer(farmer);
  }

  async deleteFarmer({ id }: { id: string }): Promise<void> {
    const farmer = await this.farmerRepository.getFarmerById(id);
    if (!farmer) {
      throw new FarmerNotFoundError({});
    }

    const totalFarms = await this.farmRepository.getTotalFarmsByFarmerId(id);
    if (totalFarms > 0) {
      throw new FarmerDeleteError({
        message: 'there.are.farms.for.this.farmer',
      });
    }

    await this.farmerRepository.deleteFarmerById(id);
  }

  async getFarmer({ idOrDocument }: { idOrDocument: string }): Promise<Farmer> {
    const farmerById = await this.farmerRepository.getFarmerById(idOrDocument);
    if (farmerById) return farmerById;

    const farmerByDocument =
      await this.farmerRepository.getFarmerByDocument(idOrDocument);
    if (farmerByDocument) return farmerByDocument;

    return undefined;
  }
}

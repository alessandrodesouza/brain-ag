import { Injectable } from '@nestjs/common';
import { FarmerRepository } from 'src/infra/db/farmRepository';
import { FarmerDuplicateDocumentError } from 'src/model/errors/farmerDuplicateDocumentError';
import { FarmerNotFoundError } from 'src/model/errors/farmerNotFoundError';
import { Farmer } from 'src/model/farmer';
import { ValidateDuplicateDocument } from 'src/model/validateDuplicatedDocument';

@Injectable()
export class FarmerService {
  constructor(
    private validateDuplicateDocument: ValidateDuplicateDocument,
    private farmerRepository: FarmerRepository,
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

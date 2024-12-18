import { Injectable } from '@nestjs/common';
import { FarmerRepository } from 'src/infra/db/farmerRepository';

@Injectable()
export class ValidateDuplicateDocument {
  constructor(private farmerRepository: FarmerRepository) {}

  async validate(document: string): Promise<boolean> {
    const result = await this.farmerRepository.getFarmerByDocument(document);
    return !!result;
  }

  async validateOther(id: string, document: string): Promise<boolean> {
    const result = await this.farmerRepository.getOtherFarmerByDocument(
      id,
      document,
    );
    return !!result;
  }
}

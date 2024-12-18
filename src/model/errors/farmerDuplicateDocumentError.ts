import { ModelError, modelErrorParams } from './modelError';

export class FarmerDuplicateDocumentError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message: message || 'farmer.duplicate.document', field });
  }
}

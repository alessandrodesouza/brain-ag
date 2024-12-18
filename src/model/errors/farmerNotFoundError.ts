import { ModelError, modelErrorParams } from './modelError';

export class FarmerNotFoundError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message: message || 'farmer.not.found', field });
  }
}

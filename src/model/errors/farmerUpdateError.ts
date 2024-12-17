import { ModelError, modelErrorParams } from './modelError';

export class FarmerUpdateError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

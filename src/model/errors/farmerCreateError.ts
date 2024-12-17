import { ModelError, modelErrorParams } from './modelError';

export class FarmerCreateError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

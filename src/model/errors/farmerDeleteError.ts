import { ModelError, modelErrorParams } from './modelError';

export class FarmerDeleteError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

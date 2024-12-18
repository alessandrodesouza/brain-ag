import { ModelError, modelErrorParams } from './modelError';

export class FarmNotFoundError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message: message || 'farm.not.found', field });
  }
}

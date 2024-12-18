import { ModelError, modelErrorParams } from './modelError';

export class FarmCreateError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

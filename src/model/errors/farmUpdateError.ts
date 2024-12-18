import { ModelError, modelErrorParams } from './modelError';

export class FarmUpdateError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

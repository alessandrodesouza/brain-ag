import { ModelError, modelErrorParams } from './modelError';

export class FarmerParserError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

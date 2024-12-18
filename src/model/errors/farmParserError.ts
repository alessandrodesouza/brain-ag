import { ModelError, modelErrorParams } from './modelError';

export class FarmParserError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message, field });
  }
}

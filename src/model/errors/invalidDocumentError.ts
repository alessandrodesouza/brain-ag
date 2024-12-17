import { ModelError, modelErrorParams } from './modelError';

export class InvalidDocumentError extends ModelError {
  constructor({ message, field }: modelErrorParams) {
    super({ message: message || 'invalid.document', field });
  }
}

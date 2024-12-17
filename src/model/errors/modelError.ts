import z from 'zod';

export type modelErrorParams = {
  message?: string;
  field?: string;
};

export abstract class ModelError extends Error {
  readonly field: string;

  constructor({ message, field }: modelErrorParams) {
    super(message);
    this.field = field;
  }

  static handleZodError<T extends ModelError>(
    error: z.ZodError,
    constructor: new (...args: any[]) => T,
  ): void {
    const message = error.errors[0].message;
    const field = error.errors[0].path.join('.');
    throw new constructor({ message, field });
  }
}

import z from 'zod';
import { Document } from './types/document';
import { ModelError } from './errors/modelError';
import { FarmerCreateError } from './errors/farmerCreateError';
import { FarmerParserError } from './errors/farmerParserError';
import { FarmerUpdateError } from './errors/farmerUpdateError';

export const farmer = z
  .object({
    id: z
      .string({ message: 'farmer.invalid.id' })
      .uuid({ message: 'farmer.invalid.id' })
      .optional(),
    document: z.string({ message: 'farmer.invalid.document' }),
    name: z
      .string({ message: 'farmer.invalid.name' })
      .min(1, { message: 'farmer.invalid.name' })
      .max(250, { message: 'farmer.invalid.name' }),
    createdAt: z.date({ message: 'farmer.invalid.createdAt' }).optional(),
    updatedAt: z.date({ message: 'farmer.invalid.updatedAt' }).optional(),
  })
  .superRefine((data, ctx) => {
    const isValidDocument = Document.tryParse(data.document);
    if (!isValidDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['document'],
        message: 'farmer.invalid.document',
      });
      return;
    }

    const document = Document.parse(data.document);
    data.document = document.value;
  });

export type ParseParams = z.infer<typeof farmer>;

export type CreateParams = {
  document: string;
  name: string;
};

export type UpdateParams = Partial<CreateParams>;

export class Farmer {
  private _id: string;
  private _document: string;
  private _name: string;
  private _createdAt: Date;
  private _updatedAt?: Date;

  private constructor(
    id: string,
    document: string,
    name: string,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._document = document;
    this._name = name;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id() {
    return this._id;
  }

  get document() {
    return this._document;
  }

  get name() {
    return this._name;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static parse(params: ParseParams): Farmer {
    const result = farmer.safeParse(params);
    if (!result.success) {
      ModelError.handleZodError(result.error, FarmerParserError);
    }

    return new Farmer(
      result.data.id,
      result.data.document,
      result.data.name,
      result.data.createdAt,
      result.data.updatedAt,
    );
  }

  static create(params: CreateParams): Farmer {
    const createParams = { ...params, createdAt: new Date() };
    const result = farmer.safeParse(createParams);
    if (!result.success) {
      ModelError.handleZodError(result.error, FarmerCreateError);
    }

    return new Farmer(
      result.data.id,
      result.data.document,
      result.data.name,
      result.data.createdAt,
    );
  }

  public update(params: UpdateParams): void {
    params.document = params.document || this.document;
    params.name = params.name || this.name;

    const updateParams = { ...this.toJSON(), ...params, updatedAt: new Date() };
    const result = farmer.safeParse(updateParams);
    if (!result.success) {
      ModelError.handleZodError(result.error, FarmerUpdateError);
    }

    this._document = result.data.document || this.document;
    this._name = result.data.name || this.name;
    this._updatedAt = result.data.updatedAt;
  }

  public toJSON() {
    return {
      id: this._id,
      document: this._document,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

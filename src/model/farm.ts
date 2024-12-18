import z from 'zod';
import { Farmer, farmer } from './farmer';
import { ModelError } from './errors/modelError';
import { FarmParserError } from './errors/farmParserError';
import { FarmCreateError } from './errors/farmCreateError';
import { FarmUpdateError } from './errors/farmUpdateError';

export enum CropTypeEnum {
  Soy = 'soy',
  Corn = 'corn',
  Cotton = 'cotton',
  Coffee = 'coffee',
  SugarCane = 'sugarCane',
}

const crop = z.object({
  type: z.nativeEnum(CropTypeEnum, { message: 'farm.invalid.cropType' }),
  totalArea: z
    .number({ message: 'farm.invalid.totalArea' })
    .positive({ message: 'farm.invalid.totalArea' }),
});

export type Crop = z.infer<typeof crop>;

const farm = z
  .object({
    id: z
      .string({ message: 'farm.invalid.id' })
      .uuid({ message: 'farm.invalid.id' })
      .optional(),
    name: z
      .string({ message: 'farm.invalid.name' })
      .min(1, { message: 'farm.invalid.name' })
      .max(250, { message: 'farm.invalid.name' }),
    city: z
      .string({ message: 'farm.invalid.city' })
      .min(1, { message: 'farm.invalid.city' })
      .max(100, { message: 'farm.invalid.city' })
      .transform((val) => val.toUpperCase()),
    state: z
      .string({ message: 'farm.invalid.state' })
      .min(2, { message: 'farm.invalid.state' })
      .max(2, { message: 'farm.invalid.state' })
      .transform((val) => val.toUpperCase()),
    totalArea: z
      .number({ message: 'farm.invalid.totalArea' })
      .positive({ message: 'farm.invalid.totalArea' }),
    cultivableArea: z
      .number({ message: 'farm.invalid.cultivableArea' })
      .positive({ message: 'farm.invalid.cultivableArea' })
      .optional(),
    vegetationArea: z
      .number({ message: 'farm.invalid.vegetationArea' })
      .positive({ message: 'farm.invalid.vegetationArea' }),
    farmer: farmer.optional(),
    crops: z
      .array(crop, { message: 'farm.empty.crops' })
      .nonempty('farm.empty.crops'),
    createdAt: z.date({ message: 'farmer.invalid.createdAt' }).optional(),
    updatedAt: z.date({ message: 'farmer.invalid.updatedAt' }).optional(),
  })
  .superRefine((data, ctx) => {
    const cultivableArea = data.crops.reduce((total, crop) => {
      total += crop.totalArea;
      return total;
    }, 0);
    data.cultivableArea = cultivableArea;

    if (data.cultivableArea + data.vegetationArea > data.totalArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['totalArea'],
        message: 'farmer.invalid.totalArea',
      });

      return;
    }
  });

export type ParseParams = z.infer<typeof farm>;

export type CreateParams = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  vegetationArea: number;
  farmer: Farmer;
  crops: Crop[];
};

export type UpdateParams = Partial<CreateParams>;

export class Farm {
  private _id: string;
  private _name: string;
  private _city: string;
  private _state: string;
  private _totalArea: number;
  private _cultivableArea: number;
  private _vegetationArea: number;
  private _farmer: Farmer;
  private _crops: Crop[];
  private _createdAt: Date;
  private _updatedAt?: Date;

  private constructor(
    id: string,
    name: string,
    city: string,
    state: string,
    totalArea: number,
    cultivableArea: number,
    vegetationArea: number,
    farmer: Farmer,
    crops: Crop[],
    createdAt: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._name = name;
    this._city = city;
    this._state = state;
    this._totalArea = totalArea;
    this._cultivableArea = cultivableArea;
    this._vegetationArea = vegetationArea;
    this._farmer = farmer;
    this._crops = crops;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get totalArea() {
    return this._totalArea;
  }

  get cultivableArea() {
    return this._cultivableArea;
  }

  get vegetationArea() {
    return this._vegetationArea;
  }

  get farmer() {
    return this._farmer;
  }

  get crops() {
    return this._crops;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static parse(params: ParseParams): Farm {
    const result = farm.safeParse(params);
    if (!result.success) {
      ModelError.handleZodError(result.error, FarmParserError);
    }

    return new Farm(
      result.data.id,
      result.data.name,
      result.data.city,
      result.data.state,
      result.data.totalArea,
      result.data.cultivableArea,
      result.data.vegetationArea,
      result.data.farmer as Farmer,
      result.data.crops,
      result.data.createdAt,
      result.data.updatedAt,
    );
  }

  static create(params: CreateParams): Farm {
    const createParams = { ...params, createdAt: new Date() };
    const result = farm.safeParse(createParams);
    if (!result.success) {
      ModelError.handleZodError(result.error, FarmCreateError);
    }

    return new Farm(
      result.data.id,
      result.data.name,
      result.data.city,
      result.data.state,
      result.data.totalArea,
      result.data.cultivableArea,
      result.data.vegetationArea,
      result.data.farmer as Farmer,
      result.data.crops,
      result.data.createdAt,
      result.data.updatedAt,
    );
  }

  public update(params: UpdateParams): void {
    params.name = params.name || this.name;
    params.city = params.city || this.city;
    params.state = params.state || this.state;
    params.totalArea = params.totalArea || this.totalArea;
    params.vegetationArea = params.vegetationArea || this.vegetationArea;
    params.farmer = params.farmer || this.farmer;
    params.crops = params.crops || this.crops;

    const updateParams = { ...this.toJSON(), ...params, updatedAt: new Date() };
    const result = farm.safeParse(updateParams);
    if (!result.success) {
      ModelError.handleZodError(result.error, FarmUpdateError);
    }

    this._name = result.data.name;
    this._city = result.data.city;
    this._state = result.data.state;
    this._totalArea = result.data.totalArea;
    this._cultivableArea = result.data.cultivableArea;
    this._vegetationArea = result.data.vegetationArea;
    this._farmer = result.data.farmer as Farmer;
    this._crops = result.data.crops;
    this._updatedAt = result.data.updatedAt;
  }

  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      city: this._city,
      state: this._state,
      totalArea: this._totalArea,
      cultivableArea: this._cultivableArea,
      vegetationArea: this._vegetationArea,
      farmer: this._farmer,
      crops: this._crops,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

import { Chance } from 'chance';
import { Farmer } from './farmer';
import { FarmerCreateError } from './errors/farmerCreateError';
import { FarmerUpdateError } from './errors/farmerUpdateError';
import { FarmerParserError } from './errors/farmerParserError';

const c = Chance.Chance();
const id = c.guid({ version: 4 });
const document = c.cpf({ formatted: true });
const name = c.name({ middle: true });
const formattedDocument = document.replace(/\D/g, '').padStart(11, '0');

describe('Given the need to create a new farmer', () => {
  describe('When valid parameters are provided', () => {
    it('A new farmer must be created', () => {
      const newFarmer = Farmer.create({ document, name });

      expect(newFarmer.document).toBe(formattedDocument);
      expect(newFarmer.name).toBe(name);
      expect(newFarmer.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('When invalid parameters are provided', () => {
    it('Should return the correct error when the document is invalid', () => {
      expect(() => Farmer.create({ document: 'invalid', name })).toThrow(
        'farmer.invalid.document',
      );
      expect(() => Farmer.create({ document: 124, name } as any)).toThrow(
        'farmer.invalid.document',
      );
      expect(() => Farmer.create({ document: 'invalid', name })).toThrow(
        FarmerCreateError,
      );
    });

    it('Should return the correct error when the name is invalid', () => {
      expect(() => Farmer.create({ document, name: '' })).toThrow(
        'farmer.invalid.name',
      );
      expect(() => Farmer.create({ document, name: 0 } as any)).toThrow(
        'farmer.invalid.name',
      );
      expect(() =>
        Farmer.create({ document, name: c.string({ length: 255 }) }),
      ).toThrow(FarmerCreateError);
    });
  });
});

describe('Given the need to update a farmer', () => {
  describe('When valid parameters are provided', () => {
    it('The update must be applied correctly', () => {
      const farmer = Farmer.create({ document, name });
      farmer.update({ name: 'New Name', document: '33.487.511/0001-39' });

      expect(farmer.document).toBe('33487511000139');
      expect(farmer.name).toBe('New Name');
      expect(farmer.updatedAt).toBeInstanceOf(Date);
    });

    it('The update only name be applied correctly', () => {
      const farmer = Farmer.create({ document, name });
      farmer.update({ name: 'New Name' });

      expect(farmer.document).toBe(formattedDocument);
      expect(farmer.name).toBe('New Name');
      expect(farmer.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('When valid parameters are provided', () => {
    it('Should return the correct error when the document is invalid', () => {
      const farmer = Farmer.create({ document, name });

      expect(() =>
        farmer.update({ name: 'New Name', document: '01.387.511/0001-15' }),
      ).toThrow('farmer.invalid.document');
      expect(() =>
        farmer.update({ name: 'New Name', document: '01.387.511/0001-15' }),
      ).toThrow(FarmerUpdateError);
    });

    it('Should return the correct error when the name is invalid', () => {
      const farmer = Farmer.create({ document, name });

      expect(() => farmer.update({ name: '' })).toThrow('farmer.invalid.name');
      expect(() => farmer.update({ name: '' })).toThrow(FarmerUpdateError);
    });
  });
});

describe('Given the need to parse a farmer', () => {
  describe('When valid parameters are provided', () => {
    it('Must correctly create a farmer', () => {
      const createdAt = new Date();
      const updatedAt = new Date();

      const farmer = Farmer.parse({
        id,
        name,
        document,
        createdAt,
        updatedAt,
      });

      const expectObject = {
        id,
        name,
        document: formattedDocument,
        createdAt,
        updatedAt,
      };

      expect(farmer.toJSON()).toEqual(expectObject);
    });
  });

  describe('When invalid parameters are provided', () => {
    it('Should return the error correctly', () => {
      expect(() => Farmer.parse({ id: '121221', name, document })).toThrow(
        'farmer.invalid.id',
      );
      expect(() => Farmer.parse({ id: '121221', name, document })).toThrow(
        FarmerParserError,
      );
    });
  });
});

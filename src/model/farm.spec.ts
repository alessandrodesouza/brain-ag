import { Chance } from 'chance';
import { Farm } from './farm';
import { FarmCreateError } from './errors/farmCreateError';

const c = Chance.Chance();

const farmer = {
  id: c.guid({ version: 4 }),
  name: c.name({ middle: true }),
  document: c.cpf({ formatted: false }),
};

const paramsToCreate: any = {
  name: 'Fazenda Terra Nossa',
  city: 'Mogi Guaçu',
  state: 'sp',
  totalArea: 10000,
  vegetationArea: 5000,
  farmer,
  crops: [
    {
      type: 'soy',
      totalArea: 1000,
    },
    {
      type: 'corn',
      totalArea: 2000,
    },
  ],
};

describe('Given the need to create a new farm', () => {
  describe('When valid parameters are provided', () => {
    it('A new farm must be created', () => {
      const expectObject = {
        id: undefined,
        name: paramsToCreate.name,
        city: paramsToCreate.city.toUpperCase(),
        state: paramsToCreate.state.toUpperCase(),
        totalArea: paramsToCreate.totalArea,
        cultivableArea: 3000,
        vegetationArea: paramsToCreate.vegetationArea,
        farmer: paramsToCreate.farmer,
        crops: paramsToCreate.crops,
        createdAt: expect.any(Date),
        updatedAt: undefined,
      };

      const newFarm = Farm.create(paramsToCreate);

      expect(newFarm.toJSON()).toEqual(expectObject);
    });
  });

  describe('When invalid parameters are provided', () => {
    it('Should return the correct error when the name is invalid', () => {
      expect(() =>
        Farm.create({ ...paramsToCreate, name: 123 } as any),
      ).toThrow('farm.invalid.name');

      expect(() =>
        Farm.create({ ...paramsToCreate, name: c.string({ length: 255 }) }),
      ).toThrow('farm.invalid.name');

      expect(() =>
        Farm.create({ ...paramsToCreate, name: c.string({ length: 255 }) }),
      ).toThrow(FarmCreateError);
    });

    it('Should return the correct error when the city is invalid', () => {
      expect(() =>
        Farm.create({ ...paramsToCreate, city: 123 } as any),
      ).toThrow('farm.invalid.city');

      expect(() => Farm.create({ ...paramsToCreate, city: '' })).toThrow(
        'farm.invalid.city',
      );

      expect(() => Farm.create({ ...paramsToCreate, name: '' })).toThrow(
        FarmCreateError,
      );
    });

    it('Should return the correct error when the state is invalid', () => {
      expect(() =>
        Farm.create({ ...paramsToCreate, state: 123 } as any),
      ).toThrow('farm.invalid.state');

      expect(() => Farm.create({ ...paramsToCreate, state: 'S' })).toThrow(
        'farm.invalid.state',
      );

      expect(() => Farm.create({ ...paramsToCreate, state: '' })).toThrow(
        FarmCreateError,
      );
    });

    it('Should return the correct error when the total area is invalid', () => {
      expect(() => Farm.create({ ...paramsToCreate, totalArea: 0 })).toThrow(
        'farm.invalid.totalArea',
      );

      expect(() => Farm.create({ ...paramsToCreate, totalArea: -157 })).toThrow(
        'farm.invalid.totalArea',
      );

      expect(() =>
        Farm.create({ ...paramsToCreate, totalArea: '454' }),
      ).toThrow(FarmCreateError);
    });

    it('Should return the correct error when the vegetation area is invalid', () => {
      expect(() =>
        Farm.create({ ...paramsToCreate, vegetationArea: 0 }),
      ).toThrow('farm.invalid.vegetationArea');

      expect(() =>
        Farm.create({ ...paramsToCreate, vegetationArea: -14557 }),
      ).toThrow('farm.invalid.vegetationArea');

      expect(() =>
        Farm.create({ ...paramsToCreate, vegetationArea: 'abd' }),
      ).toThrow(FarmCreateError);
    });

    it('Should return the correct error when the farmer is invalid', () => {
      expect(() => Farm.create({ ...paramsToCreate, farmer: {} })).toThrow(
        'farmer.invalid.document',
      );

      expect(() => Farm.create({ ...paramsToCreate, farmer: {} })).toThrow(
        FarmCreateError,
      );
    });

    it('Should return the correct error when the crops are invalid', () => {
      expect(() =>
        Farm.create({ ...paramsToCreate, crops: undefined }),
      ).toThrow('farm.empty.crops');

      expect(() => Farm.create({ ...paramsToCreate, crops: [] })).toThrow(
        'farm.empty.crops',
      );

      expect(() => Farm.create({ ...paramsToCreate, crops: [] })).toThrow(
        FarmCreateError,
      );

      expect(() =>
        Farm.create({
          ...paramsToCreate,
          crops: [
            {
              type: 'soy',
              totalArea: 5000,
            },
            {
              type: 'xxx',
              totalArea: -1,
            },
          ],
        }),
      ).toThrow('farm.invalid.cropType');

      expect(() =>
        Farm.create({
          ...paramsToCreate,
          crops: [
            {
              type: 'soy',
              totalArea: -5000,
            },
            {
              type: 'corn',
              totalArea: 10000,
            },
          ],
        }),
      ).toThrow('farm.invalid.totalArea');
    });
  });
});

describe('Given the need to update a farm', () => {
  describe('When valid parameters are provided', () => {
    it('Should update the farm correctly', () => {
      const farm = Farm.create(paramsToCreate);
      const updateObject: any = {
        name: 'Nome Trocado',
        city: 'Cidade Trocada',
        state: 'xx',
        totalArea: 11000,
        vegetationArea: 6000,
        farmer: {
          id: c.guid({ version: 4 }),
          name: c.name({ middle: true }),
          document: '292.057.320-95',
        },
        crops: [
          {
            type: 'cotton',
            totalArea: 1500,
          },
          {
            type: 'coffee',
            totalArea: 1000,
          },
        ],
      };

      farm.update(updateObject);

      expect(farm.name).toBe(updateObject.name);
      expect(farm.city).toBe(updateObject.city.toUpperCase());
      expect(farm.state).toBe(updateObject.state.toUpperCase());
      expect(farm.totalArea).toBe(updateObject.totalArea);
      expect(farm.cultivableArea).toBe(2500);
      expect(farm.vegetationArea).toBe(updateObject.vegetationArea);
      expect(farm.farmer).toEqual({
        ...updateObject.farmer,
        document: '29205732095',
      });
      expect(farm.crops).toEqual(updateObject.crops);
    });
  });
});

describe('Given the need to parse a farm', () => {
  describe('When valid parameters are provided', () => {
    it('Should must create the farm correctly', () => {
      const id = c.guid();
      const expectObject = {
        id,
        name: paramsToCreate.name,
        city: paramsToCreate.city.toUpperCase(),
        state: paramsToCreate.state.toUpperCase(),
        totalArea: paramsToCreate.totalArea,
        cultivableArea: 3000,
        vegetationArea: paramsToCreate.vegetationArea,
        farmer: paramsToCreate.farmer,
        crops: paramsToCreate.crops,
        createdAt: undefined,
        updatedAt: undefined,
      };
      const farm = Farm.parse({ ...paramsToCreate, id });

      expect(farm.toJSON()).toEqual(expectObject);
    });
  });
});

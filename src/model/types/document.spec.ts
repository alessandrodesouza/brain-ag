import { InvalidDocumentError } from '../errors/invalidDocumentError';
import { Document } from './document';

describe('Given the need to create a valid document', () => {
  describe('When a valid document is provided', () => {
    it('A new document of the CPF type must be created', () => {
      const document1 = Document.parse('243.551.660-66');
      const document2 = Document.parse('387690000');

      expect(document1.value).toBe('24355166066');
      expect(document2.value).toBe('00387690000');
    });

    it('The attempt to parse CPF should return true', () => {
      const parse1 = Document.parse('872.342.230-02');
      const parse2 = Document.parse('66760198093');

      expect(parse1).toBeTruthy();
      expect(parse2).toBeTruthy();
    });

    it('A new document of the CNPJ type must be created', () => {
      const document1 = Document.parse('11.582.377/0001-12');
      const document2 = Document.parse('6327015000145');

      expect(document1.value).toBe('11582377000112');
      expect(document2.value).toBe('06327015000145');
    });

    it('The attempt to parse CNPJ should return true', () => {
      const parse1 = Document.parse('74.104.642/0001-77');
      const parse2 = Document.parse('19914642000124');

      expect(parse1).toBeTruthy();
      expect(parse2).toBeTruthy();
    });
  });

  describe('When a invalid document is provided', () => {
    it('Should trigger the correct exception for the CPF type', () => {
      expect(() => Document.parse('143.551.660-60')).toThrow(
        'invalid.document',
      );

      expect(() => Document.parse('143.551.660-60')).toThrow(
        InvalidDocumentError,
      );
    });

    it('Should return false when attempting to parse the CPF', () => {
      expect(Document.tryParse('613.651.665-80')).toBeFalsy();
      expect(Document.tryParse('15431454158')).toBeFalsy();
    });

    it('Should trigger the correct exception for the CNPJ type', () => {
      expect(() => Document.parse('10.582.377/0003-12')).toThrow(
        'invalid.document',
      );

      expect(() => Document.parse('19934642000125')).toThrow(
        InvalidDocumentError,
      );
    });

    it('Should return false when attempting to parse the CNPJ', () => {
      expect(Document.tryParse('11.583.087/0003-24')).toBeFalsy();
      expect(Document.tryParse('55584087000899')).toBeFalsy();
    });
  });
});

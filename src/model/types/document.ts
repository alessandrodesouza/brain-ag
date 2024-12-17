import { InvalidDocumentError } from '../errors/invalidDocumentError';

function cleanString(input: string, size = 0): string {
  const cleanValue = input.replace(/\D/g, '');
  if (!size) return cleanValue;

  const formattedValue = cleanValue.padStart(size, '0');
  return formattedValue;
}

function isValidCPF(value: string): boolean {
  const cpf = cleanString(value, 11);

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder: number;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  return remainder === parseInt(cpf.charAt(10));
}

function isValidCNPJ(value: string): boolean {
  const cnpj = cleanString(value, 14);

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  let remainder: number;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;

  if (remainder !== parseInt(cnpj.charAt(12))) return false;

  sum = 0;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;

  return remainder === parseInt(cnpj.charAt(13));
}

export class Document {
  private constructor(readonly value: string) {}

  static parse(value: string): Document {
    const validCNPJ = isValidCNPJ(value);
    const validCPF = isValidCPF(value);

    if (!validCPF && !validCNPJ) {
      throw new InvalidDocumentError({ field: 'document' });
    }

    return new Document(cleanString(value, validCPF ? 11 : 14));
  }

  static tryParse(value: string): boolean {
    const validCPF = isValidCPF(value);
    const validCNPJ = isValidCNPJ(value);

    if (!validCPF && !validCNPJ) {
      return false;
    }

    return true;
  }
}

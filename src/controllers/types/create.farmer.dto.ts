import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmerDto {
  @ApiProperty({
    description: 'Farmer name',
    example: 'Antunes Zé Rural',
  })
  name: string;

  @ApiProperty({
    description: 'Document',
    example: '870.715.330-91',
  })
  document: string;
}

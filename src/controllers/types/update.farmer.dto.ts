import { ApiProperty } from '@nestjs/swagger';

export class UpdateFarmerDto {
  @ApiProperty({
    description: 'Farmer name',
    example: 'Antunes Zé Rural',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Document',
    example: '870.715.330-91',
    required: false,
  })
  document?: string;
}

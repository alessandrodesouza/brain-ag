import { ApiProperty } from '@nestjs/swagger';

export class FarmerDto {
  @ApiProperty({
    description: 'Identification',
    example: '163e2e6c-8e3d-4ad3-ade9-71ee1c06d087',
  })
  id: string;

  @ApiProperty({
    description: 'Document',
    example: '870.715.330-91',
  })
  document: string;

  @ApiProperty({
    description: 'Name',
    example: 'Pedro da Fazenda',
  })
  name: string;

  @ApiProperty({
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
  })
  updatedAt: Date;
}

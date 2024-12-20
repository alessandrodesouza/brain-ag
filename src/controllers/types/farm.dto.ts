import { ApiProperty } from '@nestjs/swagger';
import { FarmerDto } from './farmer.dto';
import { CropDto } from './crop.dto';

export class FarmDto {
  @ApiProperty({
    description: 'Identification',
    example: '563e2e6c-8e3d-4ad3-ade9-71ee1c06d088',
  })
  id: string;

  @ApiProperty({
    description: 'Name',
    example: 'Sítio do Morro Alto',
  })
  name: string;

  @ApiProperty({
    description: 'City',
    example: 'OURO FINO',
  })
  city: string;

  @ApiProperty({
    description: 'State',
    example: 'MG',
  })
  state: string;

  @ApiProperty({
    description: 'Total area',
    example: 11550,
  })
  totalArea: number;

  @ApiProperty({
    description: 'Cultivable area',
    example: 4000,
  })
  cultivableArea: number;

  @ApiProperty({
    description: 'Vegatation area',
    example: 7100,
  })
  vegetationArea: number;

  @ApiProperty({
    description: 'Farmer',
    example: {
      id: '963e2e6c-5e3d-4ad3-ade9-71ee1c06d080',
      document: '46042273060',
      name: 'João do Barro',
    },
  })
  farmer: FarmerDto;

  @ApiProperty({
    description: 'Crops',
    example: [
      {
        type: 'sugarCane',
        totalArea: 3500,
      },
      {
        type: 'corn',
        totalArea: 500,
      },
    ],
    isArray: true,
  })
  crops: Array<CropDto>;

  @ApiProperty({
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
  })
  updatedAt: Date;
}

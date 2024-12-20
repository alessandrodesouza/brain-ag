import { ApiProperty } from '@nestjs/swagger';
import { CropDto } from './crop.dto';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Farm name',
    example: 'Antunes Zé Rural',
  })
  name: string;

  @ApiProperty({
    description: 'Farm city',
    example: 'BORDA DA MATA',
  })
  city: string;

  @ApiProperty({
    description: 'Farm state',
    example: 'MG',
  })
  state: string;

  @ApiProperty({
    description: 'Farm total area',
    example: 10000,
  })
  totalArea: number;

  @ApiProperty({
    description: 'Farm vegetation area',
    example: 2000,
  })
  vegetationArea: number;

  @ApiProperty({
    description: 'Farmer identification',
    example: '4e2f0bfb-3729-4b16-a084-a0edc6c74f74',
  })
  farmerId: string;

  @ApiProperty({
    description: 'Farmer identification',
    example: [
      {
        type: 'corn',
        totalArea: 1200,
      },
      {
        type: 'coffee',
        totalArea: 3200,
      },
    ],
    isArray: true,
  })
  crops: Array<CropDto>;
}

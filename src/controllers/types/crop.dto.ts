import { ApiProperty } from '@nestjs/swagger';
import { CropTypeEnum } from 'src/model/farm';

export class CropDto {
  @ApiProperty({
    description: 'Crop type',
    example: 'corn',
    enum: ['soy', 'corn', 'cotton', 'coffee', 'sugarCane'],
  })
  type: CropTypeEnum;

  @ApiProperty({
    description: 'Crop total area',
    example: 2500,
  })
  totalArea: number;
}

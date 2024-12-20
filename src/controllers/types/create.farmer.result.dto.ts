import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmerResultDto {
  @ApiProperty({
    description: 'Farmer identification',
    example: '28123b41-dae9-4b44-80d8-6bf53d00219b',
  })
  id: string;
}

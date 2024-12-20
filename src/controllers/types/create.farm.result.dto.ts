import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmResultDto {
  @ApiProperty({
    description: 'Farm identification',
    example: '38123b41-dae9-4b44-80d8-6bf53d00219c',
  })
  id: string;
}

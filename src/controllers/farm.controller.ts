import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FarmCreateError } from '../model/errors/farmCreateError';
import { FarmerNotFoundError } from '../model/errors/farmerNotFoundError';
import { FarmNotFoundError } from '../model/errors/farmNotFoundError';
import { FarmUpdateError } from '../model/errors/farmUpdateError';
import { FarmService } from '../services/farm.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateFarmResultDto } from './types/create.farm.result.dto';
import { CreateFarmDto } from './types/create.farm.dto';
import { FarmDto } from './types/farm.dto';
import { UpdateFarmDto } from './types/update.farm.dto';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @Post()
  @ApiCreatedResponse({
    description: 'Create a Farm',
    type: CreateFarmResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  async postFarm(@Body() params: CreateFarmDto, @Res() res: Response) {
    try {
      const id = await this.farmService.createFarm({
        name: params.name,
        city: params.city,
        state: params.state,
        totalArea: params.totalArea,
        vegetationArea: params.vegetationArea,
        farmerId: params.farmerId,
        crops: params.crops,
      });

      return res.status(HttpStatus.CREATED).json({ id });
    } catch (error) {
      if (error instanceof FarmerNotFoundError) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmCreateError) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message, field: error.field });
      }

      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Get a Farm',
    type: FarmDto,
  })
  @ApiNotFoundResponse({
    description: 'Farm not found',
  })
  async getFarm(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<FarmDto>> {
    try {
      const farm = await this.farmService.getFarm({
        id,
      });

      if (!farm) {
        return res.status(HttpStatus.NOT_FOUND).end();
      }

      return res.status(HttpStatus.OK).json(farm.toJSON());
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Get('/')
  @ApiOkResponse({
    description: 'Get Farm list',
    type: FarmDto,
    isArray: true,
  })
  async getFarms(
    @Query('farmer') farmerId: string,
    @Res() res: Response,
  ): Promise<Response<Array<FarmDto>>> {
    try {
      const farms = await this.farmService.getFarms(farmerId);

      return res.status(HttpStatus.OK).json(farms);
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Update a Farm',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    description: 'Farm not found',
  })
  async patchFarmer(
    @Body() params: UpdateFarmDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.farmService.updateFarm({ ...params, id });

      return res.status(HttpStatus.OK).end();
    } catch (error) {
      if (error instanceof FarmNotFoundError) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmerNotFoundError) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmUpdateError) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message, field: error.field });
      }

      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Delete a Farm',
  })
  @ApiNotFoundResponse({
    description: 'Farm not found',
  })
  async deleteFarmer(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.farmService.deleteFarm({ id });

      return res.status(HttpStatus.OK).end();
    } catch (error) {
      if (error instanceof FarmNotFoundError) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message, field: error.field });
      }

      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Get('/dashboard/totalizers')
  @ApiOkResponse({
    description: 'Totalizers to dashboard',
    example: {
      numberOfFarms: 3,
      totalArea: 15000,
      totalCultivableArea: 4900,
      totalVegetationArea: 6000,
      totalCultivableAreaByState: {
        SP: 4200,
        MG: 700,
      },
      totalCultivableAreaByCrop: {
        soy: 1800,
        corn: 2500,
        coffee: 600,
      },
    },
  })
  async getTotalizers(@Res() res: Response) {
    try {
      const totalizers = await this.farmService.getTotalizers();

      return res.status(HttpStatus.OK).json(totalizers);
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }
}

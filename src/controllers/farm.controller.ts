import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FarmCreateError } from '../model/errors/farmCreateError';
import { FarmerNotFoundError } from '../model/errors/farmerNotFoundError';
import { FarmNotFoundError } from '../model/errors/farmNotFoundError';
import { FarmUpdateError } from '../model/errors/farmUpdateError';
import { CreateFarmParams, FarmService } from '../services/farm.service';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  async postFarm(@Body() params: CreateFarmParams, @Res() res: Response) {
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
  async getFarm(@Param('id') id: string, @Res() res: Response) {
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

  @Patch('/:id')
  async patchFarmer(
    @Body() params: { document?: string; name?: string },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
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
}

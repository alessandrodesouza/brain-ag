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
import { FarmerCreateError } from '../model/errors/farmerCreateError';
import { FarmerDeleteError } from '../model/errors/farmerDeleteError';
import { FarmerDuplicateDocumentError } from '../model/errors/farmerDuplicateDocumentError';
import { FarmerNotFoundError } from '../model/errors/farmerNotFoundError';
import { FarmerUpdateError } from '../model/errors/farmerUpdateError';
import { FarmerService } from '../services/farmer.service';
import { CreateFarmerDto } from './types/create.farmer.dto';
import { CreateFarmerResultDto } from './types/create.farmer.result.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FarmerDto } from './types/farmer.dto';
import { UpdateFarmerDto } from './types/update.farmer.dto';

@Controller('farmer')
export class FarmerController {
  constructor(private readonly farmarService: FarmerService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create a Farmer',
    type: CreateFarmerResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  async postFarmer(
    @Body() params: CreateFarmerDto,
    @Res() res: Response,
  ): Promise<Response<CreateFarmerResultDto>> {
    try {
      const id = await this.farmarService.createFarmer({
        document: params.document,
        name: params.name,
      });

      return res.status(HttpStatus.CREATED).json({ id });
    } catch (error) {
      if (error instanceof FarmerCreateError) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmerDuplicateDocumentError) {
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

  @Get('/:idOrDocument')
  @ApiOkResponse({
    description: 'Get a Farmer',
    type: FarmerDto,
  })
  @ApiNotFoundResponse({
    description: 'Farmer not found',
  })
  async getFarmer(
    @Param('idOrDocument') idOrDocument: string,
    @Res() res: Response,
  ): Promise<Response<FarmerDto>> {
    try {
      const farmer = await this.farmarService.getFarmer({
        idOrDocument: idOrDocument,
      });

      if (!farmer) {
        return res.status(HttpStatus.NOT_FOUND).end();
      }

      return res.status(HttpStatus.OK).json(farmer.toJSON());
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Get('/')
  @ApiOkResponse({
    description: 'Get Farmer list',
    type: FarmerDto,
    isArray: true,
  })
  async getFarmers(@Res() res: Response): Promise<Response<Array<FarmerDto>>> {
    try {
      const farmers = await this.farmarService.getFarmers();

      return res.status(HttpStatus.OK).json(farmers);
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'internal.server.error' });
    }
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Update a Farmer',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    description: 'Farmer not found',
  })
  async patchFarmer(
    @Body() params: UpdateFarmerDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.farmarService.updateFarmer({
        id,
        document: params.document,
        name: params.name,
      });

      return res.status(HttpStatus.OK).end();
    } catch (error) {
      if (error instanceof FarmerNotFoundError) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmerUpdateError) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmerDuplicateDocumentError) {
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
    description: 'Delete a Farmer',
  })
  @ApiNotFoundResponse({
    description: 'Farmer not found',
  })
  async deleteFarmer(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.farmarService.deleteFarmer({ id });

      return res.status(HttpStatus.OK).end();
    } catch (error) {
      if (error instanceof FarmerNotFoundError) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message, field: error.field });
      }

      if (error instanceof FarmerDeleteError) {
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
}

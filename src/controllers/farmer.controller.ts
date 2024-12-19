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

@Controller('farmer')
export class FarmerController {
  constructor(private readonly farmarService: FarmerService) {}

  @Post()
  async postFarmer(
    @Body() params: { document: string; name: string },
    @Res() res: Response,
  ) {
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
  async getFarmer(
    @Param('idOrDocument') idOrDocument: string,
    @Res() res: Response,
  ) {
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

  @Get('')
  async getFarmers(@Res() res: Response) {
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
  async patchFarmer(
    @Body() params: { document?: string; name?: string },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
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
  async deleteFarmer(@Param('id') id: string, @Res() res: Response) {
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

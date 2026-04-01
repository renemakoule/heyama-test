import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';

@Controller('objects')
export class ObjectsController {
  constructor(
    private service: ObjectsService,
    private gateway: ObjectsGateway,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const res = await this.service.create(body, file);
    this.gateway.emitNewObject(res);
    return res;
  }

  @Get() FindAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.delete(id);
    this.gateway.emitDeleteObject(id);
    return { success: true };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EntrepotService } from './entrepot.service';
import { CreateEntrepotDto, UpdateEntrepotDto } from './entrepot.dto';
import { Entrepot } from './entrepot.entity';

@Controller('entrepot')
export class EntrepotController {
  constructor(private readonly entrepotService: EntrepotService) {}

  @Post()
  create(@Body() createEntrepotDto: CreateEntrepotDto) {
    return this.entrepotService.create(createEntrepotDto);
  }

  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.entrepotService.findOne(id);
  }

  @Get()
  getAll() {
    return this.entrepotService.findAll();
  }
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEntrepotDto: UpdateEntrepotDto,
  ): Promise<Entrepot> {
    return this.entrepotService.update(id, updateEntrepotDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.entrepotService.remove(id);
  }
}

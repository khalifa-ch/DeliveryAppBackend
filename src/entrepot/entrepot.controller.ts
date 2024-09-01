import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EntrepotService } from './entrepot.service';
import { CreateEntrepotDto, UpdateEntrepotDto } from './entrepot.dto';
import { Entrepot } from './entrepot.entity';
import { JwtGuard } from 'src/guards/jwt-auth.guard';

@Controller('entrepot')
@UseGuards(JwtGuard)
export class EntrepotController {
  constructor(private readonly entrepotService: EntrepotService) {}

  @Post()
  create(
    @Body() createEntrepotDto: CreateEntrepotDto,
    @Req() req,
    @Body('cityId') cityId: string,
  ) {
    return this.entrepotService.create(createEntrepotDto, req.user, cityId);
  }
  @Get('MyEntrepots')
  async MyCars(@Req() req) {
    const userId = req.user.id;
    return this.entrepotService.getMyEntrepot(parseInt(userId));
  }
  @Get(':id')
  getEntrepot(@Param('id') id: number) {
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

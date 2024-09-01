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
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { JwtGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('store')
@UseGuards(JwtGuard)
export class StoreController {
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(id, updateStoreDto);
  }
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(
    @Body() createStoreDto: CreateStoreDto,
    @Req() req,
    @Body('cityId') cityId: string,
  ) {
    return this.storeService.create(createStoreDto, req.user, cityId);
  }

  @Get('MyStores')
  async MyCars(@Req() req) {
    const userId = req.user.id;
    return this.storeService.getMyStores(parseInt(userId));
  }
  @Get(':id')
  getStore(@Param('id') id: number) {
    return this.storeService.getById(id);
  }
  @Get()
  getAll() {
    return this.storeService.getAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.storeService.remove(id);
  }
}

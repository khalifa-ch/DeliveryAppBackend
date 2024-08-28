import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }
  @Get()
  getAll() {
    return this.orderService.findAll();
  }
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}

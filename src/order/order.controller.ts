import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { JwtGuard } from 'src/guards/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Body('storeId') storeId: string,
    @Body('cityId') cityId: string,
  ) {
    return this.orderService.create(createOrderDto, storeId, cityId);
  }
  @Get('MyOrders')
  async MyOrders(@Query('storeId') storeId: number, @Req() req) {
    const userId = req.user.id;
    return this.orderService.getMyOrders(parseInt(userId), storeId);
  }
  @Get('pickupOrders')
  async getOrdersReadyForPickup(@Req() req) {
    const userId = req.user.id;
    return this.orderService.getOrdersReadyForPickupByDeliverer(userId);
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

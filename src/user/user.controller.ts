import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from 'src/guards/refreshToken.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('storeOwner')
  async createStoreOwner(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createStoreOwner(createUserDto);
  }

  @Post('deliverer')
  async createDeliverer(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createDeliver(createUserDto);
  }

  @Get('/:id')
  async getReservation(@Param('id') id: string) {
    const user = this.userService.getById(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
  @Patch('/:id')
  Update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninUserDto) {
    return await this.authService.signin(body.email, body.password);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refreshToken')
  async refreshToken(@Req() req) {
    const payload = {
      id: req.user.id,
      email: req.user.email,
    };
    return this.authService.refreshToken(payload);
  }
}

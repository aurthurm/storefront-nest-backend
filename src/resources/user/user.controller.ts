import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserProperties } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDocument } from './entities/user.entity';
import {
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.userService.register(createUserDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  // @Roles(Role.SU_ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.userService.create(createUserDto),
    };
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.SU_ADMIN)
  async findAll() {
    return { data: await this.userService.findAll() };
  }

  @Get('filter')
  filter(
    @Query(new ValidationPipe(UserProperties)) collectionDto: any,
  ): Promise<CollectionResponse<UserDocument>> {
    return this.userService.filter(collectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.userService.findOne(id) };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return { data: await this.userService.update(id, updateUserDto) };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { data: await this.userService.remove(id) };
  }
}

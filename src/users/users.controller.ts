import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* @Get()
  getAll(): Promise<User[]> {
    try {
      return this.usersService.getAll();
    } catch (e) {
      console.log(e);
      return e;
    }
  } */

  /* @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    try {
      return this.usersService.getById(id);
    } catch (e) {
      console.log(e);
      return e;
    }
  } */

  /* @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  } */

  /* @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return this.usersService.remove(id);
    } catch (e) {
      console.log(e);
      return e;
    }
  } */

  /* @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      return this.usersService.update(id, updateUserDto);
    } catch (e) {
      console.log(e);
      return e;
    }
  } */
}

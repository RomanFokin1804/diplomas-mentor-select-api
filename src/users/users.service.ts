import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    try {
      const res = await this.usersRepository.find();
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const res = await this.usersRepository.findOne(id);
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const res = await this.usersRepository.save(createUserDto);
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      const res = await this.usersRepository.update(id, updateUserDto);
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.usersRepository.delete(id);
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

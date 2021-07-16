import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = [];

  getAll() {
    return this.users;
  }

  getById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  create(createUserDto: CreateUserDto) {
    this.users.push({
      ...createUserDto,
      id: Date.now().toString(),
    });
  }
}

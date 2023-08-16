import { Staff } from '@models/staff/staff.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StaffService } from '@services/staff/staff.service';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly staffService : StaffService ){}

  async findByUsername(username: string, password?: string): Promise<Staff> {    
    const user = await this.staffService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid Username');
    }
    
    const result = await bcrypt.compare(password, user.password);
    console.log('Result', result);
    
    if (result) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid Password')
    }
    
  }
}
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UsersService } from '../users/users.service';
import { jwtConstants } from './constans';
import { AuthLoginDto } from './auth-login.dto';
import { StaffService } from '@services/staff/staff.service';
import { CreateStaffDto } from 'src/dtos/staff/staff.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,  private jwtService: JwtService, private staffService: StaffService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username,pass);

    return user;
  }

  async login(data: AuthLoginDto) {
    const user = await this.usersService.findByUsername(data.username, data.password);
    // const tempUser = new CreateStaffDto(user);
    return {
      access_token: this.jwtService.sign({...user}, 
        { 
        secret : jwtConstants.secret}),
    };
  }
}


  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.userId };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }


   // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
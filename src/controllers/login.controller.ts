import { Controller, Request, Post, UseGuards, Get, Session, UseInterceptors, HttpCode, ValidationPipe, UsePipes, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@services/login/auth/auth.service';
import { JwtAuthGuard } from '@services/login/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@services/login/auth/local.auth.gurad';
import ResponseMapper from '@util/interceptor/response-mapper.interceptor';
import BaseController from './base.controller';
import { AuthLoginDto } from '@services/login/auth/auth-login.dto';


@Controller()
@UseInterceptors(ResponseMapper) 
export class LoginController extends BaseController<any> {
  constructor(private authService: AuthService) {super()}

  
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('auth/login')
  async login(@Body() payload: AuthLoginDto) {
    return this.authService.login(payload)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }







  //sesssion user
  @Get('users')
  async getAuthSession(@Session() session: Record<string, any>){
    console.log(session);
    console.log(session.id);
    
  }

  @Post('uauth/login')
  async AuthSession(@Session() session: Record<string, any>){
    console.log(session);
    console.log(session.id);
    
  }
}
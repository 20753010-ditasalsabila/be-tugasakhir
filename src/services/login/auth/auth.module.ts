// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { jwtConstants } from './constans';
// import { JwtStrategy } from './jwt.strategi';
// import { LocalStrategy } from './local.strategy';

// @Module({
//   imports :[PassportModule, 
//     JwtModule.register({
//       secret : jwtConstants.secret,
//       signOptions : { expiresIn: '60s'}
//     })],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
 
// })
// export class AuthModule {}


// // import { Module } from '@nestjs/common';
// // import { JwtModule } from '@nestjs/jwt';
// // import { PassportModule } from '@nestjs/passport';
// // import { UsersModule } from '../users/users.module';
// // import { AuthService } from './auth.service';
// // import { jwtConstants } from './constans';
// // import { JwtStrategy } from './jwt.strategi';
// // import { LocalStrategy } from './local.strategy';
// // import { ConfigModule } from '@nestjs/config';
// // import { async } from 'crypto-random-string';

// // @Module({
// //   imports :[
// //     PassportModule,
// //     UsersModule, 
// //     JwtModule.registerAsync({
// //       imports: [ConfigModule],
// //       useFactory: async () => ({
// //         secret : jwtConstants.secret,
// //         signOptions : { expiresIn: '60s'}
// //       })
// //     })],
// //   providers: [AuthService, LocalStrategy, JwtStrategy],
 
// // })
// // export class AuthModule {}

// // // imports :[
// // //   PassportModule,
// // //   UsersModule, 
// // //   JwtModule.register({
// // //     secret : jwtConstants.secret,
// // //     signOptions : { expiresIn: '60s'}
// // //   })],
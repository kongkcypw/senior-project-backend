// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/user.module';
import { LiffJwtStrategy } from './services/liff-jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { LineLiffModule } from 'src/external/line-liff/line-liff.module';
@Module({
  imports: [
    LineLiffModule,
    UserModule, 
    PassportModule,
  ],
  providers: [
    LiffJwtStrategy, 
    RolesGuard,      
  ],
  exports: [
    LiffJwtStrategy,
    PassportModule,
    RolesGuard
  ]
})
export class AuthModule {}
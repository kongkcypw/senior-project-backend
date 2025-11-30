import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UserService } from 'src/users/services/user.service';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { LineLiffConfigService } from 'src/external/line-liff/services/config.service';

@Injectable()
export class LiffJwtStrategy extends PassportStrategy(Strategy, 'liff-jwt') {

  constructor(
    private readonly userService: UserService,
    private readonly lineliffConfigService: LineLiffConfigService,
) {
    const liffNumericId = lineliffConfigService.liffNumericId;

    // TEMPORARY LOG: This will show in your Render logs on startup
    console.log('--- LIFF Strategy Initialized. Audience configured as:', liffNumericId, '---');

    super({
      // Extract the token from the Authorization header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,
      
      // Configure a method to get the signing key from LINE's JWKS endpoint
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: 'https://api.line.me/oauth2/v2.1/certs', // LINE's public keys
      }),
      
      // Ensure the token's issuer is LINE
      issuer: 'https://access.line.me',
      
      // Validate the audience (must match your LIFF ID)
      audience: liffNumericId,
    });
  }

  async validate(payload: any): Promise<UserInfoDto> {
    console.log('Validating LIFF JWT with payload:', payload);
    const lineUserId = payload.sub;
    const displayName = payload.name;
    const pictureUrl = payload.picture;

    const user = await this.userService.findByLineUserId(lineUserId);

    if (!user) {
      throw new UnauthorizedException('User not found in database.');
    }

    if (user.displayName !== displayName) {
        await this.userService.updateDisplayName(lineUserId, displayName);
    }

    if (user.pictureUrl !== pictureUrl) {
        await this.userService.updatePictureUrl(lineUserId, pictureUrl);
    }

    return user; 
  }
}
import { User } from 'src/modules/user/domain/entities/user';
import { AuthResponse } from '../models/auth_response';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly jwtService: JwtService) {}

  public async execute(user: User): Promise<AuthResponse> {
    const tokenPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(tokenPayload);

    return new AuthResponse(token, 3600);
  }
}

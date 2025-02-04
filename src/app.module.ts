import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

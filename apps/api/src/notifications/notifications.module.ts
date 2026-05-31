import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, NotificationsGateway],
  exports: [NotificationsService, EmailService, NotificationsGateway],
})
export class NotificationsModule {}

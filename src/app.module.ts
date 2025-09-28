import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpResponse } from './libs/common/types/response';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [AuthModule, UserModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService, HttpResponse],
})
export class AppModule {}

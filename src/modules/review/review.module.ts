import { Module } from '@nestjs/common';
import { HttpResponse } from 'src/libs/common/types/response';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { HostawayService } from 'src/libs/infra/hostaway.infra';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, HttpResponse, HostawayService],
  exports: [ReviewService],
})
export class ReviewModule {}

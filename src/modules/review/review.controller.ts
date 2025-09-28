import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { Response } from 'express';

import { HttpResponse } from 'src/libs/common/types/response';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/libs/common/guards/jwt-auth.guard';
import { UpdateReviewDto } from './dto/review.dto';
import { REVIEW_STATUS } from 'src/libs/db/base.db';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly response: HttpResponse,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getReviewDashboard(@Res() res: Response) {
    const resp = this.reviewService.getReviewDashboard();
    return this.response.okResponse(
      res,
      'dashboard returned successfully',
      resp,
    );
  }

  @Get()
  getAllReviews(
    @Query('status', new ParseEnumPipe(REVIEW_STATUS, { optional: true }))
    status: REVIEW_STATUS | undefined,
    @Res() res: Response,
  ) {
    const resp = this.reviewService.getAllReviews(status);
    return this.response.okResponse(
      res,
      'reviews returned successfully',
      resp,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  updateReviewStatus(@Body() dto: UpdateReviewDto, @Res() res: Response) {
    const resp = this.reviewService.updateReviewStatus(dto.reviewId, dto.status);
    return this.response.okResponse(
      res,
      'review updated successfully',
      resp,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('hostaway')
  async getHostawayReviews(@Query('mock') mock: string, @Res() res: Response) {
    const resp = await this.reviewService.getHostawayNormalized({
      forceMock: mock === '1' || mock === 'true',
    });
    return this.response.okResponse(
      res,
      'hostaway reviews returned successfully',
      resp,
    );
  }
}

import { IsNumber, IsString } from 'class-validator';
import {
  Review,
  REVIEW_STATUS,
} from 'src/libs/db/base.db';

export type NormalizedReview = Review & {
  channel: string; 
  submittedDate: Date; 
  submittedYMD: string; 
  overallRating: number | null;
  categories: Record<string, number>;
  approved: boolean;
};

export type GroupBucket<T> = {
  items: T[];
  count: number;
  averageRating: number | null;
};

export interface ParseAndNormalizeResult {
  byListing: Record<number, GroupBucket<NormalizedReview> & { listingName: string }>;
  byCategory: Record<string, GroupBucket<NormalizedReview>>;
  byChannel: Record<string, GroupBucket<NormalizedReview>>;
  byDate: Record<string, GroupBucket<NormalizedReview>>;
}

export interface ReviewDashboardData {
  totals: {
    uniqueListings: number;
    averageRatingAll: number | null;
    reviewsThisMonth: number;
  };
  recent: Array<{
    id: number;
    submittedAt: string;
    listingName: string;
    listingId: number;
    guestName: string;
    status: REVIEW_STATUS;
    rating: number | null;
    publicReview: string | null;
  }>;
}

export class UpdateReviewDto {
  @IsString()
  status: REVIEW_STATUS;

  @IsNumber()
  reviewId: number;
}

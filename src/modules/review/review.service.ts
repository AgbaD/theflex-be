import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import {
  findAll,
  findOne,
  findOneAndUpdate,
  Review,
  REVIEW_STATUS,
} from 'src/libs/db/base.db';
import {
  GroupBucket,
  NormalizedReview,
  ParseAndNormalizeResult,
  ReviewDashboardData,
} from './dto/review.dto';
import { HostawayService } from 'src/libs/infra/hostaway.infra';

@Injectable()
export class ReviewService {
  constructor(private readonly hostawayService: HostawayService) {}

  private parseDate(s: string): Date {
    const isoish = s.includes('T') ? s : s.replace(' ', 'T');
    const d = new Date(isoish);
    if (isNaN(d.getTime())) throw new BadRequestException(`Invalid submittedAt date: ${s}`);
    return d;
  }

  private ymd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private overallRating(review: Review | { rating: number | null; reviewCategory?: { rating: number }[] }): number | null {
    if (typeof review.rating === 'number') return review.rating;
    const cats = Array.isArray((review as any).reviewCategory) ? (review as any).reviewCategory : [];
    const vals = cats.map((c) => c.rating).filter((v) => typeof v === 'number');
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  private avg(nums: number[]): number | null {
    const vals = nums.filter((n) => typeof n === 'number' && !isNaN(n));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  private flattenCategories(arr?: { category: string; rating: number }[]) {
    const cats: Record<string, number> = {};
    (arr ?? []).forEach((c) => {
      if (typeof c?.rating === 'number') cats[c.category] = c.rating;
    });
    return cats;
  }

  private mapStatusFromString(s: string | REVIEW_STATUS | undefined): REVIEW_STATUS {
    if (!s) return REVIEW_STATUS.HIDDEN;
    if (s === REVIEW_STATUS.PUBLISHED || s === REVIEW_STATUS.HIDDEN) return s;
    const k = String(s).toLowerCase();
    return k === 'published' ? REVIEW_STATUS.PUBLISHED : REVIEW_STATUS.HIDDEN;
  }

  private ensureListingId(r: any): number {
    if (typeof r.listingId === 'number') return r.listingId;
    const name = String(r.listingName ?? 'unknown');
    return Math.abs(
      name.split('').reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0),
    );
  }

  private normalizeOneFromDb(r: Review): NormalizedReview {
    const submittedDate = this.parseDate(r.submittedAt);
    return {
      ...r,
      channel: r.type || 'unknown',
      submittedDate,
      submittedYMD: this.ymd(submittedDate),
      overallRating: this.overallRating(r),
      categories: this.flattenCategories(r.reviewCategory),
      approved: r.status === REVIEW_STATUS.PUBLISHED,
    };
  }

  private normalizeOneFromHostaway(raw: any): NormalizedReview {
    const submittedDate = this.parseDate(raw.submittedAt);
    const listingId = this.ensureListingId(raw);
    const status = this.mapStatusFromString(raw.status);
    return {
      id: Number(raw.id),
      type: raw.type ?? 'host-to-guest',
      status,
      rating: raw.rating ?? null,
      publicReview: raw.publicReview ?? null,
      reviewCategory: Array.isArray(raw.reviewCategory) ? raw.reviewCategory : [],
      submittedAt: raw.submittedAt,
      guestName: raw.guestName ?? 'Guest',
      listingName: raw.listingName ?? 'Unknown',
      listingId,
      channel: raw.type ?? 'unknown',
      submittedDate,
      submittedYMD: this.ymd(submittedDate),
      overallRating: this.overallRating(raw),
      categories: this.flattenCategories(raw.reviewCategory),
      approved: false,
    };
  }

  parseAndNormalize(where?: Partial<Review>): ParseAndNormalizeResult {
    const rows = findAll('reviews', where);
    const normalized = rows.map((r) => this.normalizeOneFromDb(r));

    const byListing: ParseAndNormalizeResult['byListing'] = {};
    const byCategory: ParseAndNormalizeResult['byCategory'] = {};
    const byChannel: ParseAndNormalizeResult['byChannel'] = {};
    const byDate: ParseAndNormalizeResult['byDate'] = {};

    const pushToBucket = <T extends NormalizedReview>(
      bucket: Record<string | number, GroupBucket<T>>,
      key: string | number,
      item: T,
    ) => {
      if (!bucket[key]) bucket[key] = { items: [], count: 0, averageRating: null } as GroupBucket<T>;
      bucket[key].items.push(item);
      bucket[key].count++;
    };

    normalized.forEach((nr) => {
      pushToBucket(byListing as any, nr.listingId, nr);
      (byListing as any)[nr.listingId].listingName = nr.listingName;

      for (const cat of Object.keys(nr.categories)) {
        pushToBucket(byCategory as any, cat, nr);
      }
      
      pushToBucket(byChannel as any, nr.channel || 'unknown', nr);
      pushToBucket(byDate as any, nr.submittedYMD, nr);
    });

    const computeBucketAverages = (obj: Record<any, GroupBucket<NormalizedReview>>) => {
      for (const key of Object.keys(obj)) {
        const ratings = obj[key].items
          .map((i) => i.overallRating)
          .filter((v): v is number => typeof v === 'number');
        obj[key].averageRating = this.avg(ratings);
      }
    };

    computeBucketAverages(byListing as any);
    computeBucketAverages(byCategory as any);
    computeBucketAverages(byChannel as any);
    computeBucketAverages(byDate as any);

    return { byListing, byCategory, byChannel, byDate };
  }

  getReviewDashboard(limitRecent = 10): ReviewDashboardData {
    const all = findAll('reviews');
    const normalized = all.map((r) => this.normalizeOneFromDb(r));

    const uniqueListings = new Set(normalized.map((r) => r.listingId)).size;

    const averageRatingAll = this.avg(
      normalized.map((r) => r.overallRating).filter((v): v is number => typeof v === 'number'),
    );

    const now = new Date();
    const reviewsThisMonth = normalized.filter((r) => {
      const d = r.submittedDate;
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const recent = normalized
      .sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime())
      .slice(0, Math.max(0, limitRecent))
      .map((r) => ({
        id: r.id,
        submittedAt: r.submittedAt,
        listingId: r.listingId,
        listingName: r.listingName,
        guestName: r.guestName,
        status: r.status,
        rating: r.overallRating,
        publicReview: r.publicReview,
      }));

    return {
      totals: {
        uniqueListings,
        averageRatingAll,
        reviewsThisMonth,
      },
      recent,
    };
  }

  updateReviewStatus(reviewId: number, status: REVIEW_STATUS) {
    if (!Object.values(REVIEW_STATUS).includes(status)) {
      throw new BadRequestException('Invalid review status');
    }
    const existing = findOne('reviews', { id: reviewId });
    if (!existing) throw new NotFoundException('Review not found');

    const updated = findOneAndUpdate('reviews', { id: reviewId }, { status });
    return {
      data: updated!,
      message: 'Review status updated',
    };
  }

  getAllReviews(status?: REVIEW_STATUS): Review[] {
    if (status) {
      if (!Object.values(REVIEW_STATUS).includes(status)) {
        throw new BadRequestException(`Invalid status: ${status}`);
      }
      return findAll('reviews', { status });
    }
    return findAll('reviews');
  }

  async getHostawayNormalized(opts?: { forceMock?: boolean }): Promise<NormalizedReview[]> {
    try {
      const resp = await this.hostawayService.getReviews(opts?.forceMock || false);
      if (resp.status !== 'success' || !Array.isArray(resp.result)) {
        throw new Error('Invalid response from Hostaway');
      }
      const raw = resp.result;
      return raw.map((r: any) => this.normalizeOneFromHostaway(r));
    } catch (error) {
      throw new InternalServerErrorException(`Hostaway fetch/normalize failed: ${error.message}`);
    }
  }
}

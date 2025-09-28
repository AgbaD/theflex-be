import axios from 'axios';
import { Config } from 'src/config';
import { Injectable } from '@nestjs/common';

export const hostawayMock = {
  status: 'success',
  result: [
    {
      id: 7453,
      type: 'host-to-guest',
      status: 'hidden',
      rating: null,
      publicReview: 'Shane and family are wonderful! Would definitely host again :)',
      reviewCategory: [
        { category: 'cleanliness', rating: 10 },
        { category: 'communication', rating: 10 },
        { category: 'respect_house_rules', rating: 10 },
      ],
      submittedAt: '2020-08-21 22:45:14',
      guestName: 'Shane Finkelstein',
      listingName: '2B N1 A - 29 Shoreditch Heights',
    },
    {
      id: 7456,
      type: "host-to-guest",
      status: 'published',
      rating: 10,
      publicReview: "Perfect guest! Highly recommended.",
      reviewCategory: [
        { category: "cleanliness", rating: 10 },
        { category: "communication", rating: 10 },
        { category: "respect_house_rules", rating: 10 },
      ],
      submittedAt: "2020-08-17 20:15:00",
      guestName: "Sophia Martinez",
      listingName: "Beachfront Condo Miami",
    },
    {
      id: 7457,
      type: "guest-to-host",
      status: 'hidden',
      rating: 7,
      publicReview: "Good location but the WiFi was weak.",
      reviewCategory: [
        { category: "cleanliness", rating: 7 },
        { category: "communication", rating: 9 },
        { category: "respect_house_rules", rating: 8 },
      ],
      submittedAt: "2020-08-10 09:20:00",
      guestName: "Daniel Lee",
      listingName: "Sunny Loft in Brooklyn",
    },
  ],
} as const;


@Injectable()
export class HostawayService {
  constructor() {}

  async getReviews(forceMock: boolean) {
    try {
      const apiKey = Config.HOSTAWAY_API_KEY;
      const accountId = Config.HOSTAWAY_ACCOUNT_ID;

      const apiInstance = axios.create({
        baseURL: Config.HOSTAWAY_BASE_URL,
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      });
      const response = await apiInstance.get(
        `reviews?accountId=${accountId}`
      );
      const data = response.data;
      if (forceMock && (!data || !Array.isArray(data.result) || data.result.length === 0)) {
        return hostawayMock;
      }
      return data;
    } catch (error) {
        if (forceMock) {
          return hostawayMock;
        }
      throw new Error(
        `Fetching reviews failed: ${error.message}`,
      );
    }
  }
}

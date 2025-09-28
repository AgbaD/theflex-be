import axios from 'axios';
import { Config } from 'src/config';
import { Injectable } from '@nestjs/common';

type GoogleReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  publishTime?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlaceDetailsResponse = {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
};

@Injectable()
export class GoogleService {
  constructor() {}

  async getReviews(placeId: string) {
    try {
      const apiKey = Config.GOOGLE_PLACES_API_KEY;
      const baseURL = Config.GOOGLE_PLACES_BASE_URL;

      const apiInstance = axios.create({
        baseURL: baseURL,
        headers: {
          'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
        },
      });
      const fieldMask = 'id,displayName,rating,userRatingCount,googleMapsUri,reviews';
      const response = await apiInstance.get<PlaceDetailsResponse>(
        `/places/${encodeURIComponent(placeId)}`,
        { headers: { 'X-Goog-FieldMask': fieldMask } }
        );
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(
        `Fetching reviews failed: ${error.message}`,
      );
    }
  }
}

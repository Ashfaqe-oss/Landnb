import { Listing, Reservation, User, listingsAndReviews } from '@prisma/client';

export type SafeListing = Omit<Listing, "createdAt"> & {
  name: string;
  createdAt: string;
  summary: string;
  images: [];
  picture_url: string;
  street: string;
  room_type: string;
  listing_url: string;
  // host: [];
  host_url: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing?: SafeListing;
  listingsAndReviews?: listingsAndReviews;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

import prisma from "@/app/libs/prismadb";
import axios from "axios";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  roomType?: string;
}

export default async function getListingsFiltered(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
      roomType,
    } = params;

    let query: any = {};
    let queryLAR: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
      queryLAR.bedrooms = {
        gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
      queryLAR.accommodates = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
      queryLAR.bathrooms = {
        gte: +bathroomCount,
      };
    }

    // if (locationValue ) {
    //   query.locationValue = locationValue;
    //   queryLAR.address.country_code = locationValue;
    // }

    if (locationValue) {
      query.locationValue = locationValue;
      // if (
      //   locationValue === "BR" ||
      //   locationValue === "PT" ||
      //   locationValue === "US" ||
      //   locationValue === "AU" ||
      //   locationValue === "HK" ||
      //   locationValue === "CA"
      // ) {
      //   queryLAR.address = queryLAR.address || {};
      //   queryLAR.address.country_code = locationValue;
      // }
    }

    if (roomType) {
      queryLAR.room_type = roomType;
    }

    // room_type = "Entire home/apt", Private room

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate }, //greater than or equal to
                startDate: { lte: startDate }, //less than or equal to
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    const listingsAR = await prisma.listingsAndReviews.findMany({
      where: queryLAR,
      take: 130,
    });

    const isValidUrl = async (url: string) => {
      try {
        const response = await axios.head(url);
        return (
          response.status === 200 &&
          response.headers["content-type"].startsWith("image/")
        );
      } catch (error) {
        return false;
      }
    };

    const safeListingsAR = await Promise.all(
      listingsAR.map(async (listing) => {
        const imageSrc = listing.images?.picture_url || "";
        const locationValue = listing.address.country_code;
        const street = listing.address.street;
        const isValidImageUrl = await isValidUrl(imageSrc);
        return {
          ...listing,
          locationValue,
          street,
          imageSrc: isValidImageUrl ? imageSrc : "",
        };
      })
    );

    return [...safeListings, ...safeListingsAR];
  } catch (error: any) {
    throw new Error(error);
  }
}

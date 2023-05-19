import prisma from "@/app/libs/prismadb";
import axios from "axios";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favListingsIds = (currentUser.favoriteIds || []).filter(
      (id) => id.length === 24
    );
    const favListingsARIds = (currentUser.favoriteIds || []).filter(
      (id) => id.length === 8
    );

    const favListings = await prisma.listing.findMany({
      where: {
        id: {
          in: favListingsIds,
        },
      },
    });

    const safeFavorites = favListings.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
    }));

    const favListingsAR = await prisma.listingsAndReviews.findMany({
      where: {
        id: {
          in: favListingsARIds,
        },
      },
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

    const filteredFavListingsAR = await Promise.all(
      favListingsAR
        .filter((listing) => listing.address.country_code === "US")
        .map(async (listing) => {
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

    return [...safeFavorites, ...filteredFavListingsAR];
  } catch (error: any) {
    throw new Error(error);
  }
}

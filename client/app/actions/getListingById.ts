import prisma from "@/app/libs/prismadb";
import axios from "axios";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  try {
    if (listingId.length === 24) {
      const listing = await prisma.listing.findUnique({
        where: {
          id: listingId,
        },
        include: {
          user: true,
        },
      });

      if (!listing) {
        return null;
      }

      return {
        ...listing,
        createdAt: listing.createdAt.toString(),
        user: {
          ...listing.user,
          createdAt: listing.user.createdAt.toString(),
          updatedAt: listing.user.updatedAt.toString(),
          emailVerified: listing.user.emailVerified?.toString() || null,
        },
      }

      //else
    } else {
        const listingAR = await prisma.listingsAndReviews.findUnique({
            where: {
                id: listingId,
            },
            include: {
                user: true
            }
        })
  
      return {
        ...listingAR, 
        locationValue: listingAR?.address.country_code,
        street : listingAR?.address.street,
        imageSrc: listingAR?.images?.picture_url,
      }
  
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

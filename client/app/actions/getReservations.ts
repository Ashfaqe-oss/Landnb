import prisma from "@/app/libs/prismadb";
import axios from "axios";

interface IParams {
  listingId?: string; //in listing
  userId?: string; //in my trips
  adminId?: string; //in my reservations
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, adminId } = params;

    const query: any = {};

    if (listingId && listingId?.length === 24) {
      query.listingId = listingId;
    } else {
      query.listingsAndReviewsId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (adminId) {
      query.listing = { userId: adminId };
    }

    if (listingId?.length === 24) {
      const reservations = await prisma.reservation.findMany({
        where: query,
        include: {
          listing: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const safeReservations = reservations.map((reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing,
          createdAt: reservation?.listing?.createdAt.toISOString(),
        },
      }));

      return safeReservations;
    } else {

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
              listingsAndReviews: true,
            },
            orderBy: {
              createdAt: "desc",
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

          // .map(async (listing) => {
          //   const imageSrc = listing.images?.picture_url || "";
          //   const locationValue = listing.address.country_code;
          //   const street = listing.address.street;
          //   const isValidImageUrl = await isValidUrl(imageSrc);
          //   return {
          //     ...listing,
          //     locationValue,
          //     street,
          //     imageSrc: isValidImageUrl ? imageSrc : "",
          //   };
          // })

          const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listingsAndReviews: {
              ...reservation.listingsAndReviews,
              street: reservation?.listingsAndReviews?.address.street,
              imageSrc: reservation?.listingsAndReviews?.images.picture_url,
            },
          }));
    
          return safeReservations;
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

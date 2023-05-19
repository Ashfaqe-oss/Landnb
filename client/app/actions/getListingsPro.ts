import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
}

export default async function getListingsPro(params: IListingsParams) {
  try {
    const { userId } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
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
      name: "",
      summary: "",
      images: [],
      picture_url: "",
      street: "",
      room_type: "",
      listing_url: "",
      host_url: "",
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}

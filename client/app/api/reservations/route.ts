import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { listingsAndReviews } from "@prisma/client";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { startDate, listingId, endDate, totalPrice } = body;

  if (!startDate || !endDate || !listingId || !totalPrice) {
    return NextResponse.error();
  }

  //take the listing and add the reservation to it.
  //creates a new reservation on that listing

  if (listingId.length === 24) {
    const listing = await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        reservations: {
          create: {
            userId: currentUser.id,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });
    return NextResponse.json(listing);
  } else {
    let listingsAndReservation;
    listingsAndReservation = await prisma.listingsAndReviews.update({
      where: {
        id: listingId,
      },
      data: {
        reservations: {
          create: {
            userId: currentUser.id,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });
    return NextResponse.json(listingsAndReservation);
  }
}

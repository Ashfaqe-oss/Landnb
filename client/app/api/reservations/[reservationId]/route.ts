import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  reservationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;
  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID !");
  }

  //delete reservation
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      //to ensure deleting powers are only with one who created reservation or one who created listing
      OR: [
        { userId: currentUser.id },
        {
          listing: { userId: currentUser.id },
        },
      ],
    },
  });

  return NextResponse.json(reservation)
}

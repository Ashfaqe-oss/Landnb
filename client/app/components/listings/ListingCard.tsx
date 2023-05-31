"use client";

import { Listing, Reservation, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
// import { format } from 'date-fns';
// import { useRouter } from "next/navigation";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import HeartButton from "../HeartButton";
import { format } from "date-fns";
import Link from "next/link";
import getListingById from "@/app/actions/getListingById";
import Button from "../Button";
import toast from "react-hot-toast";
import { postData } from "@/app/helpers/stripe-url";
import { getStripe } from "@/app/libs/stripeClient";

interface ListingCardProps {
  listing: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null; //SafeUser
  listingId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  listingId,
}) => {
  const router = useRouter();

  // console.log("listing", listingId, listing)

  const { getByValue } = useCountries();

  const location = getByValue(listing?.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return listing?.price;
  }, [reservation, listing?.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  // console.log(listing);

  const handlePayment = async () => {
    if (!currentUser) {
      // setPriceIdLoading(undefined);
      return toast.error("You Must be logged in !");
    }

    try {
      console.log("striping", price);
      const { sessionId } = await postData({
        url: "/api/payment",
        data: { price },
      });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    }
  };

  if (!listing?.imageSrc) {
    return null;
  }

  return (
    <div
      onClick={() => router.push(`/listings/${listing.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      {/* <div className="hover:scale-105 transition m-2 items-center justify-center p-2 rounded-2xl"> */}
      <div className="flex h-full flex-col gap-1 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={listing?.imageSrc}
            alt="Listing"
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <HeartButton listingId={listing.id} currentUser={currentUser} />
          </div>
        </div>

        {listing.street ? (
          <div className="font-semibold text-lg mt-1">{listing?.street}</div>
        ) : (
          <div className="font-semibold text-lg mt-1">
            {location?.label}, {location?.region}
          </div>
        )}
        <div className="font-light text-neutral-500">
          {reservationDate || listing.category || listing.room_type}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">night</div>}
          {listing.listing_url && (
            <Link
              href={listing.listing_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-xs underline ml-4 text-neutral-400 justify-end">
                Go to airbnb
              </div>
            </Link>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <p className="p-1">{listing.name || listing.title}</p>
          <p className="flex flex-1 h-full p-1 font-light text-sm text-neutral-500">
            {listing?.description.slice(0, 135)}
          </p>
        </div>

        <button onClick={handlePayment}>Pay ${price}</button>
        {onAction && actionLabel && (
          <div className="flex flex-row gap-4">
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;

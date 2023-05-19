"use client";

import dynamic from "next/dynamic";
import { IconType } from "react-icons";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeUser } from "@/app/types";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import Link from "next/link";
import { useMemo } from "react";
// import ListingCategory from "./ListingCategory";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  listing: any;
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  listing,
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng;

  const bC = bathroomCount ? bathroomCount : Math.round(listing.bathrooms);
  const rC = roomCount ? roomCount : Math.round(listing.bedrooms);
  const gC = guestCount ? guestCount : listing.accommodates;

  const price = useMemo(() => {
    // if (reservation) {
    //   return reservation.totalPrice;
    // }

    return listing.price;
  }, [listing.price]);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          {listing?.host?.host_name ? (
            <div>Hosted by {listing?.host?.host_name}</div>
          ) : (
            <div>Hosted by {user?.name}</div>
          )}
          {listing?.host?.host_picture_url ? (
            <Avatar src="/images/placeholder.jpg" />
          ) : (
            <Avatar src={user?.image} />
          )}
        </div>
        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div>{gC} guests</div>
          <div>{rC} rooms</div>
          <div>{bC} bathrooms</div>
        </div>
      </div>
      <hr />
      {category ? (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description}
        />
      ) : (
        <div>
          <div className="flex flex-row items-start gap-1">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">$ {price}</div>
                <div className="font-light">night</div>
              </div>
              {listing.weekly_price && (
                <div className="flex flex-row items-center gap-1">
                  <div className="font-light">Weekly price</div>
                  <div className="font-semibold">$ {listing.weekly_price}</div>
                  <div className="font-light">night</div>
                </div>
              )}
              {listing.cleaning_fee && (
                <div className="flex flex-row items-center gap-1">
                  <div className="font-semibold">$ {listing.cleaning_fee}</div>
                  <div className="font-light text-sm ">Cleaning price</div>
                </div>
              )}
            </div>

            {listing?.listing_url && (
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
        </div>
      )}
      <hr />
      <p className="font-semibold text-lg">About</p>
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {description}
      </div>
      {!user && (
        <>
          <hr />
          <div className="flex flex-row">
            <div className="flex-1 flex-col items-start gap-1">
              <p className="font-semibold text-lg mb-4">Amenities</p>
              {listing?.amenities?.map((amn: string) => (
                <p key={amn} className="font-light text-neutral-500">
                  {amn}
                </p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-lg mb-4">Review Score</p>
              <p className="text-4xl p-4 text-neutral-500">
                {listing?.review_scores?.review_scores_rating / 10}{" "}
              </p>
            </div>
          </div>

          <hr />
          <div className="flex flex-row">
            <div className="flex-1 flex-col items-start gap-1">
              <p className="font-semibold text-lg mb-4">Reviews</p>
              {listing?.reviews
                ?.slice(0, 5)
                .map((review: any, index: number) => (
                  <div key={index} className=" flex flex-col gap-4 mt-4">
                    <hr />
                    <p className="font-light text-neutral-500">
                      {review.comments} -{" "}
                      <span className="text-black text-sm">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      <hr />
      <Map center={coordinates} />
    </div>
  );
};

export default ListingInfo;

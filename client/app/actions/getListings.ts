import prisma from "@/app/libs/prismadb";
import axios from "axios";

export default async function getListings() {
  try {
    const ourListings = await prisma.listing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = ourListings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    const listingsAR = await prisma.listingsAndReviews.findMany({ take: 80 });

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

    const filteredListingsAR = await Promise.all(
      listingsAR
        .filter(
          (listing) =>
            listing.address.country_code === "US" ||
            listing.address.country_code === "CA" ||
            listing.address.country_code === "AU" 
            // listing.address.country_code === "UK"
        )
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

    return [...safeListings, ...filteredListingsAR];
  } catch (error: any) {
    throw new Error(error);
  }
}

// const listing = await prisma.listingsAndReviews.findUnique({
//     where: {
//       id: "1000654*",
//     },
//     include: {
//       images: true,
//       host: true,
//       address: true,
//       availability: true,
//       review_scores: true,
//       reviews: true,
//     },
//   });

// _id
// "10096773"
// listing_url
// "https://www.airbnb.com/rooms/10096773"
// name
// "Easy 1 Bedroom in Chelsea"
// summary
// "A comfortable one bedroom for responsible guests. Plenty of natural li…"
// space
// "*I listed this place late so can be flexible for you. I'm quick to res…"
// description
// "A comfortable one bedroom for responsible guests. Plenty of natural li…"
// neighborhood_overview
// "Chelsea is considered a high end neighborhood in NYC.  (URL HIDDEN)"
// notes
// ""
// transit
// ""
// access
// ""
// interaction
// "I am available to help you any time and will provide a cell # for ques…"
// house_rules
// "This is my "real" apartment not one of those places that is constantly…"
// property_type
// "Apartment"
// room_type
// "Entire home/apt"
// bed_type
// "Real Bed"
// minimum_nights
// "2"
// maximum_nights
// "1125"
// cancellation_policy
// "flexible"
// last_scraped
// 2019-03-06T05:00:00.000+00:00
// calendar_last_scraped
// 2019-03-06T05:00:00.000+00:00
// first_review
// 2016-01-03T05:00:00.000+00:00
// last_review
// 2016-01-03T05:00:00.000+00:00
// accommodates
// 2
// bedrooms
// 1
// beds
// 1
// number_of_reviews
// 1
// bathrooms
// 1.0

// amenities
// Array
// price
// 145.00
// weekly_price
// 1000.00
// cleaning_fee
// 60.00
// extra_people
// 0.00
// guests_included
// 1

// images
// Object

// host
// Object

// address
// Object
// street
// "New York, NY, United States"
// suburb
// "Manhattan"
// government_area
// "Chelsea"
// market
// "New York"
// country
// "United States"
// country_code
// "US"

// location
// Object

// availability
// Object

// review_scores
// Object

// reviews
// Array

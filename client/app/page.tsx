export const dynamic = 'force-dynamic'

import Image from "next/image";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import getCurrentUser from "./actions/getCurrentUser";
import getListings from "./actions/getListings";
import ListingCard from "./components/listings/ListingCard";
import getListingsFiltered, { IListingsParams } from "./actions/getListingsFiltered";

interface HomeProps {
  searchParams: IListingsParams
};

export default async function Home({ searchParams }: HomeProps) {
  //Home is also a server component by default

  let listings = await getListings();

  if(searchParams.startDate && searchParams.endDate || searchParams.locationValue || searchParams.guestCount || searchParams.roomType) {
    const filListings = await getListingsFiltered(searchParams)
    listings = [...filListings, ...listings.splice(0, 20)] 
  }
  // const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();
  console.log(listings);
  // console.log(currentUser)

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }
  return (
    <Container>
      <div
        className=" 
        scrollbar-hide
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-4
          "
      >
        {listings.map((listing: any, index: number) => (
          <>
            <ListingCard
              currentUser={currentUser}
              key={listing.id + index}
              listing={listing}
              listingId={listing.id}
            />
          </>
        ))}
      </div>
    </Container>
  );
}

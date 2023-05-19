
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";

import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId: string;
}

//IN SERVER COMPONENTS CANNOT USE HOOKS

const ListingPage = async ({ params }: { params: IParams }) => {
  // console.log(params)

  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
        <EmptyState />
    );
  }

  return (
      <ListingClient
        listing={listing}
        reservations={reservations}
        currentUser={currentUser}
      />
  );
}
 
export default ListingPage;

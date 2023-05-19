"use client";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "../types";
import ListingCard from "../components/listings/ListingCard";
import Container from "../components/Container";
import Heading from "../components/Heading";

interface TripsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  console.log(reservations);

  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success('Reservation cancelled');
      router.refresh();
    })
    .catch((error) => {
      // toast.error(error?.response?.data?.error, 'Something went wrong')
      toast.error('Oops, Something went wrong')
    })
    .finally(() => {
      setDeletingId('');
    })
  }, [router]);

  return (
    <Container>
      <div className="-mb-12 mt-4">

      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going"
      />
      </div>

      <div
        className="
          scrollbar-hide
            pt-16
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-4
        "
      >
        {reservations.map((reservation: any) => (
          <ListingCard
            key={reservation.id}
            listing={reservation.listingsAndReviewsId ? reservation.listingsAndReviews : reservation.listingId ? reservation.listing : []}
            listingId={reservation.listingsAndReviewsId ? reservation.listingsAndReviewsId : reservation.listingId ? reservation.listingId : ""}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default TripsClient;

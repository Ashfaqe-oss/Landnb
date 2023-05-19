"use client";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeListing, SafeUser } from "../types";
import ListingCard from "../components/listings/ListingCard";
import Container from "../components/Container";
import Heading from "../components/Heading";

interface PropertiesClientProps {
  listings: any[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  // console.log(listings);

  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/listings/${id}`)
    .then(() => {
      toast("Listing Deleted !", {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 4000,
      });      router.refresh();
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
        title="Properties"
        subtitle="List of your properties"
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
        {listings.map((listing: SafeListing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete Property !"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;

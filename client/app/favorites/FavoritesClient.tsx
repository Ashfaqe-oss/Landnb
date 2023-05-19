import { SafeListing, SafeUser } from "../types";
import ListingCard from "../components/listings/ListingCard";
import Heading from "../components/Heading";
import Container from "../components/Container";

interface favoritesClientProps {
  listings: any[];
  currentUser?: SafeUser | null;
}
const FavoritesClient: React.FC<favoritesClientProps> = ({
  listings,
  currentUser,
}) => {
  // console.log(listings);
  return (
    <Container>
      <div className="mb-2 mt-4">
        <Heading title="Favorites" subtitle="List of places you favorited!" />
      </div>
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing: any) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            listing={listing}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;

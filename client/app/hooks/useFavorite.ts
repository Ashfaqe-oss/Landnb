import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  // memo for has_Favourited

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  //callback for toggleFavorite
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        toast("You need to login", {
          icon: "👋",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 4000,
        });

        return loginModal.onOpen();
      }

      try {
        

        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
          toast("You disliked", {
            icon: "💔",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
            duration: 4000,
          });
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
          await toast("You Liked ", {
            icon: "💖",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
            duration: 4000,
          });
        }

        await request();
        router.refresh();
        
      } catch (error) {
        toast("Ouch, Something went wrong", {
          icon: "😓",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 4000,
        });
        console.log(error);
      }
    },
    [currentUser, listingId, hasFavorited, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;

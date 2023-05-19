"use client";

import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    // console.log("clicked category box", label);

    let currentQuery = {}; //Settting empty query

    if (params) {
      currentQuery = qs.parse(params.toString()); //parse query string to objectt
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    }; //spread current query and add new category

    if (params?.get("category") === label) {
      delete updatedQuery.category; //error handling category
    } //check if already selected and remove it

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    ); //setting up the url
    // The url is constructed using qs.stringifyUrl() from the qs library. The url is set to '/', indicating the root URL, and the query is set to the updatedQuery object. The skipNull option is used to exclude null or undefined values from the resulting URL.

    router.push(url);
  }, [label, router, params]);

  return (
    <div
      onClick={handleClick}
      className={`
      flex 
      flex-col 
      items-center 
      justify-center 
      gap-2
      p-3
      border-b-2
      hover:text-neutral-800
      transition
      cursor-pointer
      ${selected ? "border-b-neutral-800" : "border-transparent"}
      ${selected ? "text-neutral-800" : "text-neutral-500"}
    `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;

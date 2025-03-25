"use client";

import ListingCard from "@/components/listing/ListingCard";

const listings = [
  {
    id: "762632213174916471",
    title: "Cabin in Lake Arrowhead",
    subtitle: "61 miles away · 5 nights · Apr 6-11",
    location: "Lake Arrowhead, California",
    price: 249,
    rating: 5.0,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/3923490053.jpeg",
      "https://ext.same-assets.com/3140348022/2690710167.jpeg",
      "https://ext.same-assets.com/3140348022/1423073146.jpeg",
    ],
  },
  {
    id: "47818404",
    title: "Cabin in Lake Arrowhead",
    subtitle: "63 miles away · 5 nights · Mar 30-Apr 4",
    location: "Lake Arrowhead, California",
    price: 195,
    rating: 4.98,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/843743078.jpeg",
      "https://ext.same-assets.com/3140348022/2690710167.jpeg",
      "https://ext.same-assets.com/3140348022/808373612.jpeg",
    ],
  },
  {
    id: "804497309451316843",
    title: "Cabin in Lake Arrowhead",
    subtitle: "62 miles away · 5 nights · Mar 30-Apr 4",
    location: "Lake Arrowhead, California",
    price: 215,
    rating: 4.96,
    images: [
      "https://ext.same-assets.com/3140348022/277918512.jpeg",
      "https://ext.same-assets.com/3140348022/2676372492.jpeg",
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
    ],
  },
  {
    id: "1003992571704084083",
    title: "Cabin in Lake Arrowhead",
    subtitle: "64 miles away · 5 nights · Apr 28-May 3",
    location: "Lake Arrowhead, California",
    price: 275,
    rating: 4.99,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/3811120941.jpeg",
      "https://ext.same-assets.com/3140348022/540570917.jpeg",
      "https://ext.same-assets.com/3140348022/2933046090.jpeg",
    ],
  },
  {
    id: "45954588",
    title: "Cabin in Crestline",
    subtitle: "56 miles away · 5 nights · Apr 27-May 2",
    location: "Crestline, California",
    price: 189,
    rating: 4.94,
    images: [
      "https://ext.same-assets.com/3140348022/2676372492.jpeg",
      "https://ext.same-assets.com/3140348022/554927045.jpeg",
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
    ],
  },
  {
    id: "50402801",
    title: "Cabin in Lebec",
    subtitle: "68 miles away · 5 nights · Apr 7-12",
    location: "Lebec, California",
    price: 209,
    rating: 4.91,
    images: [
      "https://ext.same-assets.com/3140348022/808373612.jpeg",
      "https://ext.same-assets.com/3140348022/2975331289.jpeg",
      "https://ext.same-assets.com/3140348022/540570917.jpeg",
    ],
  },
  {
    id: "689896224520282255",
    title: "Cabin in Big Bear",
    subtitle: "84 miles away · 5 nights · Apr 8-13",
    location: "Big Bear, California",
    price: 225,
    rating: 4.85,
    images: [
      "https://ext.same-assets.com/3140348022/554927045.jpeg",
      "https://ext.same-assets.com/3140348022/2933046090.jpeg",
      "https://ext.same-assets.com/3140348022/843743078.jpeg",
    ],
  },
  {
    id: "964501064620071613",
    title: "Cabin in Big Bear Lake",
    subtitle: "81 miles away · 5 nights · Mar 23-28",
    location: "Big Bear Lake, California",
    price: 265,
    rating: 5.0,
    isTopRated: true,
    images: [
      "https://ext.same-assets.com/3140348022/1483408660.jpeg",
      "https://ext.same-assets.com/3140348022/277918512.jpeg",
      "https://ext.same-assets.com/3140348022/3811120941.jpeg",
    ],
  },
];

const ListingsGrid = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            subtitle={listing.subtitle}
            images={listing.images}
            location={listing.location}
            price={listing.price}
            rating={listing.rating}
            isTopRated={listing.isTopRated}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingsGrid;

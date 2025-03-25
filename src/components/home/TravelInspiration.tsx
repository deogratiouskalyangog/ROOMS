"use client";

import Link from "next/link";

// Mock data for travel inspiration links
const inspirationLinks = [
  {
    region: "Canmore",
    type: "Apartment rentals",
    url: "/canmore-canada/stays/apartments"
  },
  {
    region: "Benalmadena",
    type: "Apartment rentals",
    url: "/benalmadena-spain/stays/apartments"
  },
  {
    region: "Marbella",
    type: "Apartment rentals",
    url: "/marbella-spain/stays/apartments"
  },
  {
    region: "Mijas",
    type: "Apartment rentals",
    url: "/mijas-spain/stays/apartments"
  },
  {
    region: "Prescott",
    type: "Cabin rentals",
    url: "/prescott-az/stays/cabins"
  },
  {
    region: "Scottsdale",
    type: "Mansion rentals",
    url: "/scottsdale-az/stays/mansions"
  },
  {
    region: "Tucson",
    type: "Rentals with pools",
    url: "/tucson-az/stays/pools"
  },
  {
    region: "Jasper",
    type: "Cabin rentals",
    url: "/jasper-ar/stays/cabins"
  },
  {
    region: "Mountain View",
    type: "Family-friendly rentals",
    url: "/mountain-view-ar/stays/family-friendly"
  },
  {
    region: "Devonport",
    type: "Cottage rentals",
    url: "/devonport-australia/stays/cottages"
  },
  {
    region: "Mallacoota",
    type: "Pet-friendly rentals",
    url: "/mallacoota-australia/stays/pet-friendly"
  },
  {
    region: "Ibiza",
    type: "Vacation rentals",
    url: "/ibiza-spain/stays"
  },
  {
    region: "Anaheim",
    type: "Condo rentals",
    url: "/anaheim-ca/stays/condos"
  },
  {
    region: "Monterey",
    type: "Cottage rentals",
    url: "/monterey-ca/stays/cottages"
  },
  {
    region: "Paso Robles",
    type: "House rentals",
    url: "/paso-robles-ca/stays/houses"
  },
];

const TravelInspiration = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold mb-6">Inspiration for future getaways</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3">
        {inspirationLinks.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className="text-sm hover:underline"
          >
            <span className="font-medium">{link.region}</span>
            <span className="block text-gray-500">{link.type}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TravelInspiration;

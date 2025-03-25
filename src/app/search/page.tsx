import { Suspense } from "react";
import { Calendar } from "lucide-react";
import ClientSearchResults from "@/components/search/ClientSearchResults";
import { Metadata } from "next";

// Define metadata for SEO
export const metadata: Metadata = {
  title: "Search Listings | Airbnb Clone",
  description: "Find the perfect place to stay from our selection of properties worldwide.",
};

// Export that this page should be statically generated
export const dynamic = "force-static";

// Loading state component
const SearchLoading = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-12"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <ClientSearchResults />
    </Suspense>
  );
}

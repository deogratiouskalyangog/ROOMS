"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CalendarIcon, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

type SearchLocation = {
  id: string;
  name: string;
  state: string;
  country: string;
}

// Popular locations
const popularLocations: SearchLocation[] = [
  { id: "1", name: "Los Angeles", state: "California", country: "United States" },
  { id: "2", name: "New York", state: "New York", country: "United States" },
  { id: "3", name: "Miami", state: "Florida", country: "United States" },
  { id: "4", name: "San Francisco", state: "California", country: "United States" },
  { id: "5", name: "Lake Arrowhead", state: "California", country: "United States" },
  { id: "6", name: "Big Bear", state: "California", country: "United States" },
  { id: "7", name: "Idyllwild", state: "California", country: "United States" },
];

type SearchModalProps = {
  children?: React.ReactNode;
  compact?: boolean;
};

const SearchModal = ({ children, compact = false }: SearchModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("where");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState(1);
  const [searchResults, setSearchResults] = useState<SearchLocation[]>([]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);

    // Filter locations based on input
    if (value.length > 0) {
      const filtered = popularLocations.filter((loc) =>
        loc.name.toLowerCase().includes(value.toLowerCase()) ||
        loc.state.toLowerCase().includes(value.toLowerCase()) ||
        loc.country.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleLocationSelect = (location: SearchLocation) => {
    setLocation(`${location.name}, ${location.state}`);
    setSearchResults([]);
    setActiveTab("when");
  };

  const handleSearch = () => {
    // Build query params
    const params = new URLSearchParams();

    if (location) {
      params.append("location", location);
    }

    if (dateRange.from) {
      params.append("checkIn", format(dateRange.from, "yyyy-MM-dd"));
    }

    if (dateRange.to) {
      params.append("checkOut", format(dateRange.to, "yyyy-MM-dd"));
    }

    if (guests > 1) {
      params.append("guests", guests.toString());
    }

    // Close the dialog
    setOpen(false);

    // Navigate to the search results page
    router.push(`/search?${params.toString()}`);
  };

  const handleDatesSelect = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    if (range.from && range.to) {
      setActiveTab("who");
    }
  };

  // Determine if the search button should be enabled
  const isSearchEnabled = location.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <div className="border border-gray-200 rounded-full shadow-sm hover:shadow-md transition py-2 pl-6 pr-2 flex items-center gap-4 cursor-pointer">
            <div className="flex-1 flex flex-col">
              <span className="text-sm font-medium">Anywhere</span>
              {!compact && (
                <>
                  <div className="flex text-gray-500 text-xs">
                    <span>Any week</span>
                    <span className="mx-1">·</span>
                    <span>Add guests</span>
                  </div>
                </>
              )}
            </div>
            <Button size="icon" variant="default" className="rounded-full h-8 w-8 bg-primary">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-lg font-semibold text-center">Search for places to stay</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 px-4">
            <TabsTrigger value="where" className="rounded-xl">Where</TabsTrigger>
            <TabsTrigger value="when" className="rounded-xl">When</TabsTrigger>
            <TabsTrigger value="who" className="rounded-xl">Who</TabsTrigger>
          </TabsList>
          <TabsContent value="where" className="p-4">
            <div className="space-y-4">
              <div className="border rounded-xl p-3 flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  placeholder="Search destinations"
                  className="border-0 focus-visible:ring-0 pl-0"
                  value={location}
                  onChange={handleLocationChange}
                />
              </div>

              {searchResults.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <div className="p-3 bg-gray-50 font-medium text-sm">
                    Search Results
                  </div>
                  <ul className="divide-y">
                    {searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="p-3 flex items-start hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLocationSelect(result)}
                      >
                        <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-gray-500">{result.state}, {result.country}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {location.length === 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Popular destinations</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {popularLocations.map((location) => (
                      <div
                        key={location.id}
                        className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location.name}, {location.state}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="when" className="p-4">
            <div className="space-y-4">
              <div className="border rounded-xl p-3 flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  {dateRange.from ? (
                    dateRange.to ? (
                      <span>
                        {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span>{format(dateRange.from, "MMM d, yyyy")} - Add end date</span>
                    )
                  ) : (
                    <span className="text-gray-500">Select dates</span>
                  )}
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDatesSelect}
                  className="rounded-md mx-auto"
                  numberOfMonths={2}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="who" className="p-4">
            <div className="space-y-4">
              <div className="border rounded-xl p-3 flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span>
                  {guests} {guests === 1 ? "guest" : "guests"}
                </span>
              </div>

              <div className="border rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Guests</h3>
                    <p className="text-sm text-gray-500">How many people are coming?</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{guests}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuests(guests + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="border-t p-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSearch}
            disabled={!isSearchEnabled}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;

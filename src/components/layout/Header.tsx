"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Globe,
  Menu,
  Search,
  User,
} from "lucide-react";
import SearchModal from "@/components/search/SearchModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by moving window event listener to useEffect
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Check initial scroll position
    handleScroll();

    // Clean up the event listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-sm border-b' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Mobile Hidden, Desktop Visible */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://ext.same-assets.com/1951721302/1248550479.svg"
                alt="Airbnb Logo"
                width={102}
                height={32}
                className="text-primary"
              />
            </Link>
          </div>

          {/* Logo - Mobile Only */}
          <div className="md:hidden">
            <Link href="/" className="flex items-center">
              <Image
                src="https://ext.same-assets.com/1951721302/1248550479.svg"
                alt="Airbnb Logo"
                width={30}
                height={32}
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <SearchModal />
          </div>

          {/* Mobile Search Bar */}
          <div className="flex md:hidden flex-1 justify-center">
            <SearchModal compact={true} />
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Button variant="ghost" className="rounded-full text-sm font-medium">
                Airbnb your home
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
              <Globe className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full flex items-center gap-3 p-1 pl-3 border-gray-200">
                  <Menu className="h-4 w-4" />
                  <div className="bg-gray-500 text-white rounded-full p-1">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-6">
                  <Link href="#" className="py-2 px-3 text-sm font-medium hover:bg-gray-100 rounded-md">Sign up</Link>
                  <Link href="#" className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md">Log in</Link>
                  <div className="border-t my-2"></div>
                  <Link href="#" className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md">Airbnb your home</Link>
                  <Link href="#" className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md">Host an experience</Link>
                  <Link href="#" className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md">Help</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

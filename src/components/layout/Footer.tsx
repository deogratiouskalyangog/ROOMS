import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ROOMS</h3>
            <p className="text-gray-400">
              Find your perfect place to stay around the world.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms" className="text-gray-400 hover:text-white">
                  All Listings
                </Link>
              </li>
              <li>
                <Link href="/rooms/search?location=New+York" className="text-gray-400 hover:text-white">
                  New York
                </Link>
              </li>
              <li>
                <Link href="/rooms/search?location=London" className="text-gray-400 hover:text-white">
                  London
                </Link>
              </li>
              <li>
                <Link href="/rooms/search?location=Paris" className="text-gray-400 hover:text-white">
                  Paris
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Host</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/host" className="text-gray-400 hover:text-white">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/host/resources" className="text-gray-400 hover:text-white">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/host/community" className="text-gray-400 hover:text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ROOMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

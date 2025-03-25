import Navbar from '@/components/layout/Navbar';
import BookingCard from '@/components/booking/BookingCard';
import FeaturedListings from '@/components/home/FeaturedListings';
import PopularDestinations from '@/components/home/PopularDestinations';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Find your perfect getaway
                </h1>
                <p className="text-xl mb-6">
                  Discover amazing places to stay around the world
                </p>
              </div>
              
              <div className="md:ml-auto">
                <BookingCard />
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Listings Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Places to Stay</h2>
          <FeaturedListings />
        </div>
        
        {/* Popular Destinations Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>
            <PopularDestinations />
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">J</span>
                </div>
                <div>
                  <h3 className="font-semibold">John D.</h3>
                  <p className="text-gray-600 text-sm">New York, USA</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Amazing experience! The place was exactly as described, clean and in a perfect location. Would definitely book again."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-semibold">Sarah M.</h3>
                  <p className="text-gray-600 text-sm">London, UK</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The host was incredibly responsive and helpful. The apartment was beautiful and had everything we needed for our stay."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">R</span>
                </div>
                <div>
                  <h3 className="font-semibold">Robert T.</h3>
                  <p className="text-gray-600 text-sm">Sydney, Australia</p>
                </div>
              </div>
              <p className="text-gray-700">
                "We had a wonderful time. The location was perfect for exploring the city, and the place itself was comfortable and stylish."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

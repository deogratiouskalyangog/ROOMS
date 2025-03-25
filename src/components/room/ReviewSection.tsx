"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, X, ThumbsUp, MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock review data
const mockUsers = [
  { id: 1, name: "John Smith", avatar: "https://ext.same-assets.com/3140348022/3254845582.jpeg", joined: "January 2020" },
  { id: 2, name: "Sarah Johnson", avatar: "https://ext.same-assets.com/3140348022/4133599845.jpeg", joined: "March 2021" },
  { id: 3, name: "Michael Lee", avatar: "https://ext.same-assets.com/3140348022/1485304520.jpeg", joined: "May 2018" },
  { id: 4, name: "Emma Wilson", avatar: "https://ext.same-assets.com/3140348022/4245677124.jpeg", joined: "October 2019" },
  { id: 5, name: "David Martinez", avatar: "https://ext.same-assets.com/3140348022/2436790512.jpeg", joined: "February 2022" },
  { id: 6, name: "Rebecca Taylor", avatar: "https://ext.same-assets.com/3140348022/3945612857.jpeg", joined: "July 2023" },
  { id: 7, name: "Thomas Brown", avatar: "https://ext.same-assets.com/3140348022/1734986420.jpeg", joined: "April 2021" },
  { id: 8, name: "Lisa Chen", avatar: "https://ext.same-assets.com/3140348022/2847591634.jpeg", joined: "December 2019" },
];

const generateMockReviews = (roomId: string, count: number) => {
  const categories = ["Cleanliness", "Accuracy", "Communication", "Location", "Check-in", "Value"];
  const comments = [
    "We had an amazing stay! The place was just as described, very clean and cozy. The host was very responsive and helpful.",
    "Beautiful location and a very comfortable home. We enjoyed our stay and would definitely come back again.",
    "This place exceeded our expectations. The views were stunning and the amenities were perfect for our family getaway.",
    "Great host, great location. The property was well maintained and had everything we needed for a relaxing weekend.",
    "Very clean and comfortable space. The host was friendly and communication was excellent throughout our stay.",
    "Loved the location and the space was perfect for our needs. The kitchen was well equipped and the beds were very comfortable.",
    "Wonderful experience from start to finish. The property was exactly as described and the host was very accommodating.",
    "Perfect getaway spot! The place was clean, comfortable and had all the amenities we needed. Highly recommend!",
    "An absolute gem! The location was perfect and the property was immaculate. We will definitely be back!",
    "Amazing views and a very comfortable stay. The host was responsive and made sure we had everything we needed.",
  ];

  return Array(count).fill(0).map((_, index) => {
    const user = mockUsers[index % mockUsers.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 120)); // Random date within last 120 days

    const ratings = {};
    categories.forEach(category => {
      ratings[category.toLowerCase()] = 4 + Math.floor(Math.random() * 2); // Random rating between 4-5
    });

    return {
      id: `review-${roomId}-${index}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      date: date.toISOString(),
      rating: 4 + Math.random(), // Random rating between 4-5
      comment: comments[index % comments.length],
      categoryRatings: ratings,
      helpful: Math.floor(Math.random() * 20), // Random number of helpful votes
      response: index % 5 === 0 ? {
        from: "Host",
        text: "Thank you for your lovely review! We're so glad you enjoyed your stay and would love to welcome you back anytime.",
        date: new Date(date.getTime() + 86400000).toISOString(), // Host responded a day later
      } : null,
    };
  });
};

type ReviewSectionProps = {
  roomId: string;
  totalReviews: number;
  rating: number;
};

const ReviewSection = ({ roomId, totalReviews, rating }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [categories, setCategories] = useState([
    { name: "Cleanliness", rating: 4.8 },
    { name: "Accuracy", rating: 4.9 },
    { name: "Communication", rating: 5.0 },
    { name: "Location", rating: 4.7 },
    { name: "Check-in", rating: 4.9 },
    { name: "Value", rating: 4.6 },
  ]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    categoryRatings: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkin: 5,
      value: 5,
    }
  });

  // Initialize reviews with mock data
  useEffect(() => {
    const mockReviews = generateMockReviews(roomId, totalReviews);
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
  }, [roomId, totalReviews]);

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredReviews(reviews);
      return;
    }

    const filtered = reviews.filter(review =>
      review.comment.toLowerCase().includes(term.toLowerCase()) ||
      review.userName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredReviews(filtered);
  };

  // Format date to Month Year (e.g., "March 2023")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Add a new review
  const handleAddReview = () => {
    const newReviewObj = {
      id: `review-${roomId}-${reviews.length}`,
      userId: mockUsers[0].id,
      userName: mockUsers[0].name,
      userAvatar: mockUsers[0].avatar,
      date: new Date().toISOString(),
      rating: newReview.rating,
      comment: newReview.comment,
      categoryRatings: newReview.categoryRatings,
      helpful: 0,
      response: null,
    };

    setReviews([newReviewObj, ...reviews]);
    setFilteredReviews([newReviewObj, ...reviews]);
    setShowAddReviewModal(false);

    // Reset form
    setNewReview({
      rating: 5,
      comment: "",
      categoryRatings: {
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkin: 5,
        value: 5,
      }
    });
  };

  const StarRating = ({ rating, setRating = null }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating && setRating(i)}
          className={`${setRating ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`h-5 w-5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        </button>
      );
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="py-8 border-b">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">⭐ {rating.toFixed(2)} · {totalReviews} reviews</h2>
      </div>

      {/* Category ratings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <span className="text-gray-700">{category.name}</span>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <Progress value={category.rating * 20} className="h-1 bg-gray-200" />
              <span className="min-w-[28px] text-sm text-gray-700">{category.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search reviews */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search reviews"
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 border-gray-300 focus-visible:ring-gray-400"
        />
      </div>

      {/* Reviews list */}
      <div className="space-y-8 mb-8">
        {filteredReviews.length > 0 ? (
          filteredReviews.slice(0, 6).map((review) => (
            <div key={review.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={review.userAvatar}
                    alt={review.userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{review.userName}</h3>
                  <p className="text-gray-500 text-sm">{formatDate(review.date)}</p>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>

              {/* Host response */}
              {review.response && (
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <h4 className="font-medium">Response from {review.response.from}</h4>
                  <p className="text-gray-500 text-sm mb-2">{formatDate(review.response.date)}</p>
                  <p className="text-gray-700">{review.response.text}</p>
                </div>
              )}

              {/* Helpful button */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-gray-700 text-sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful · {review.helpful}
                </Button>
              </div>

              <Separator />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews match your search</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Show all reviews and add review buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" className="border-black text-black">
          Show all {totalReviews} reviews
        </Button>

        <Dialog open={showAddReviewModal} onOpenChange={setShowAddReviewModal}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-black text-black">
              Write a review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl mb-4">Share your experience</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Overall rating</h3>
                <StarRating rating={newReview.rating} setRating={(val) => setNewReview({...newReview, rating: val})} />
              </div>

              <div>
                <h3 className="font-medium mb-4">Rate your experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(newReview.categoryRatings).map((category) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-sm capitalize">{category}</label>
                        <StarRating
                          rating={newReview.categoryRatings[category]}
                          setRating={(val) => setNewReview({
                            ...newReview,
                            categoryRatings: {
                              ...newReview.categoryRatings,
                              [category]: val
                            }
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Share details of your experience</h3>
                <Textarea
                  placeholder="What did you like? What can be improved? Your review will be public on the listing page."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowAddReviewModal(false)}>Cancel</Button>
                <Button onClick={handleAddReview} disabled={!newReview.comment.trim()}>Submit review</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ReviewSection;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from '@/contexts/auth-context';
import { ensureStorageBuckets } from '@/lib/supabase-storage';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb | Vacation rentals, cabins, beach houses, & more",
  description: "Get an Airbnb for every kind of trip → 7 million vacation rentals → 2 million Guest Favorites → 220+ countries and regions worldwide",
};

// Call this function to ensure buckets exist
// This is a client-side function, so we need to handle it appropriately
if (typeof window !== 'undefined') {
  ensureStorageBuckets().catch(console.error);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

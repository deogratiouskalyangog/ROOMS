import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black text-white px-4">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-5xl font-bold">404</h1>
        <div className="h-14 w-px bg-white opacity-50"></div>
        <p className="text-lg">This page could not be found.</p>
      </div>
      <Button asChild className="bg-white text-black hover:bg-gray-100">
        <Link href="/">Go back home</Link>
      </Button>
      <div className="mt-4 text-sm text-gray-400">
        If you were expecting something to be here, please contact support.
      </div>
    </div>
  );
}

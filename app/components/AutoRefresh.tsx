'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function AutoRefresh() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Set up the interval to refresh every 5 seconds (5000ms)
    const interval = setInterval(() => {
      setIsRefreshing(true);
      router.refresh(); // This fetches new data from the server
      
      // Stop the spinning icon after 1 second
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 10000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold border border-gray-700 z-50">
      <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
      {isRefreshing ? "Updating..." : "Live"}
    </div>
  );
}
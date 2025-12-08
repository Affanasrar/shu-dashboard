import connectDB from '@/lib/db';
import Ride from '@/models/Ride';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AllRidesPage() {
  await connectDB();
  const rides = await Ride.find({})
    .populate('driver', 'firstName lastName')
    .populate('passengers', 'firstName lastName email img')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-black">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-gray-600 font-bold hover:text-black mb-4"><ArrowLeft size={16} className="mr-2"/> Back to Dashboard</Link>
        <h1 className="text-4xl font-black text-black">All Rides ({rides.length})</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JSON.parse(JSON.stringify(rides)).map((ride: any) => (
          <div key={ride._id} className="bg-white p-5 rounded-lg shadow-md border-2 border-gray-300 hover:border-black transition-colors flex flex-col h-full">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2 py-1 rounded font-black uppercase ${ride.status === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
                    {ride.status}
                  </span>
                  <span className="text-lg font-black text-green-700 bg-green-100 px-2 rounded">{ride.fare} PKR</span>
                </div>
                
                {/* Route */}
                <div className="font-black text-xl text-black mb-1">{ride.from} <span className="text-gray-400">➜</span> {ride.to}</div>
                <div className="text-xs text-gray-700 font-bold mb-4" suppressHydrationWarning>
                   {new Date(ride.datetime).toLocaleString()}
                </div>
                
                {/* Driver */}
                <div className="flex items-center gap-2 mb-4 bg-gray-100 p-2 rounded border border-gray-300">
                  <span className="text-xs font-black text-gray-600 uppercase">Driver:</span>
                  <span className="text-sm font-bold text-black">{ride.driver?.firstName || 'Unknown'}</span>
                </div>

                {/* Passengers */}
                <div className="mt-auto border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-black uppercase">Passengers</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        (ride.passengers?.length || 0) >= ride.seats ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {ride.passengers?.length || 0} / {ride.seats} Seats
                    </span>
                  </div>

                  {(!ride.passengers || ride.passengers.length === 0) ? (
                     <div className="text-xs text-gray-500 italic font-bold py-3 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                        No passengers
                     </div>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {ride.passengers.map((p: any) => (
                        <div key={p._id} className="flex items-center gap-3 bg-white border border-gray-300 p-2 rounded shadow-sm">
                           <img src={p.img} alt="p" className="w-8 h-8 rounded-full border border-black object-cover bg-gray-200" />
                           <div className="overflow-hidden">
                              <div className="text-xs font-black text-black truncate">{p.firstName} {p.lastName}</div>
                              <div className="text-[10px] text-gray-600 font-bold truncate">{p.email}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
          </div>
        ))}
      </div>
    </div>
  );
}
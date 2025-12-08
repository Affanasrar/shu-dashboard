import connectDB from '@/lib/db';
import Vehicle from '@/models/Vehicle';
import Link from 'next/link';
import { ArrowLeft, Car } from 'lucide-react';

export default async function AllVehiclesPage() {
  await connectDB();
  // Fetch all vehicles and populate owner details
  const vehicles = await Vehicle.find({})
    .populate('user', 'firstName lastName email img')
    .sort({ createdAt: -1 })
    .lean();

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-black">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-gray-600 font-bold hover:text-black mb-4"><ArrowLeft size={16} className="mr-2"/> Back to Dashboard</Link>
        <h1 className="text-4xl font-black text-black flex items-center gap-3">
            <Car size={40} className="text-black"/> All Vehicles ({vehicles.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serialize(vehicles).map((v: any) => (
          <div key={v._id} className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-300 hover:border-black transition-all">
             
             {/* Header: Type & Plate */}
             <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${v.vehicleType === 'car' ? 'bg-blue-100 text-blue-900' : 'bg-orange-100 text-orange-900'}`}>
                    {v.vehicleType}
                </span>
                <span className="font-mono font-black text-lg bg-gray-900 text-white px-2 py-1 rounded">{v.numberPlate}</span>
             </div>

             {/* Car Details */}
             <div className="mb-4">
                <div className="text-2xl font-black text-black">{v.model}</div>
                <div className="text-sm font-bold text-gray-500 uppercase mt-1">Color: <span className="text-black">{v.color}</span></div>
             </div>

             {/* Owner Info */}
             <div className="pt-4 border-t-2 border-gray-100 flex items-center gap-3">
                <img src={v.user?.img} alt="Owner" className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"/>
                <div>
                    <div className="text-sm font-black text-black">{v.user?.firstName} {v.user?.lastName}</div>
                    <div className="text-xs font-bold text-gray-500">{v.user?.email}</div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
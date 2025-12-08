import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default async function AllComplaintsPage() {
  await connectDB();
  const complaints = await Complaint.find({}).sort({ createdAt: -1 }).lean();
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-black">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-gray-600 font-bold hover:text-black mb-4"><ArrowLeft size={16} className="mr-2"/> Back to Dashboard</Link>
        <h1 className="text-4xl font-black text-black flex items-center gap-3">
            <MessageSquare size={40} className="text-red-600"/> All Complaints ({complaints.length})
        </h1>
      </div>

      <div className="space-y-4 max-w-4xl">
        {serialize(complaints).map((comp: any) => (
          <div key={comp._id} className="bg-white p-6 rounded-lg shadow-sm border-l-8 border-red-600 ring-1 ring-gray-300 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <h3 className="font-black text-black text-xl mb-2">{comp.subject}</h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded" suppressHydrationWarning>
                    {new Date(comp.createdAt).toLocaleDateString()}
                </span>
            </div>
            
            <p className="text-gray-900 font-medium text-lg leading-relaxed bg-red-50 p-4 rounded-lg border border-red-100">
                "{comp.description}"
            </p>

            <div className="text-sm text-gray-700 mt-4 font-bold flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 rounded text-xs">FROM</span>
              <span className="text-black text-base">{comp.name || 'Anonymous'}</span> 
              <span className="text-gray-400 font-normal">({comp.email})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
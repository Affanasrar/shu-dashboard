import connectDB from '@/lib/db';
import User from '@/models/User';
import UserRow from '../components/UserRow'; // Note the ".." to go back up
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AllStudentsPage() {
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-black">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-gray-600 font-bold hover:text-black mb-4"><ArrowLeft size={16} className="mr-2"/> Back to Dashboard</Link>
        <h1 className="text-4xl font-black text-black">All Students ({users.length})</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-black text-white uppercase text-sm font-bold">
            <tr>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Rides</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {serialize(users).map((user: any) => (
              <UserRow key={user._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
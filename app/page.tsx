export const dynamic = 'force-dynamic';

import connectDB from '@/lib/db';
import User from '@/models/User';
import PaymentRequest from '@/models/PaymentRequest';
import Ride from '@/models/Ride';
import Complaint from '@/models/Complaint';
import Vehicle from '@/models/Vehicle';
import UserRow from './components/UserRow'; // Ensure you have this
import { approvePayment, rejectPayment } from './actions';
import { LayoutDashboard, Users, CreditCard, Car, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Import Link for navigation

// Interface for StatCard
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

async function getDashboardData() {
  await connectDB();
  
  // FETCH COUNTS (For the top cards)
  const userCount = await User.countDocuments();
  const paymentCount = await PaymentRequest.countDocuments({ status: 'pending' });
  const rideCount = await Ride.countDocuments({ status: 'pending' });
  const complaintCount = await Complaint.countDocuments();

  // FETCH RECENT DATA (Limit 5)
  const [recentUsers, payments, recentRides, recentComplaints] = await Promise.all([
    User.find({}).sort({ createdAt: -1 }).limit(5).lean(), // Only 5 users
    PaymentRequest.find({}).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).lean(), // Keep payments full (action required)
    Ride.find({})
      .populate('driver', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(6) // Only 6 rides
      .lean(),
    Complaint.find({}).sort({ createdAt: -1 }).limit(3).lean() // Only 3 complaints
  ]);

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));
  
  return { 
    counts: { userCount, paymentCount, rideCount, complaintCount },
    users: serialize(recentUsers), 
    payments: serialize(payments), 
    rides: serialize(recentRides), 
    complaints: serialize(recentComplaints),
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white fixed h-full hidden md:block border-r border-gray-800">
        <div className="p-6 text-2xl font-black tracking-wider text-green-400">SHU ADMIN</div>
        <nav className="mt-6 space-y-2 px-4">
          <Link href="/" className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800"><LayoutDashboard size={20} /> <span className="font-bold">Overview</span></Link>
          <Link href="/payments" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><CreditCard size={20} /> <span>Payments</span></Link>
          <Link href="/students" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><Users size={20} /> <span>Students</span></Link>
          <Link href="/rides" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><Car size={20} /> <span>Rides</span></Link>
          <Link href="/vehicles" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><Car size={20} /> <span>Vehicles</span></Link>
          <Link href="/complaints" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><MessageSquare size={20} /> <span>Complaints</span></Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 bg-gray-50">
        
        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Students" value={data.counts.userCount} icon={<Users />} color="bg-blue-600" />
          <StatCard title="Pending Payments" value={data.counts.paymentCount} icon={<CreditCard />} color="bg-yellow-600" />
          <StatCard title="Active Rides" value={data.counts.rideCount} icon={<Car />} color="bg-green-600" />
          <StatCard title="Total Complaints" value={data.counts.complaintCount} icon={<MessageSquare />} color="bg-red-600" />
        </section>

        {/* 1. PAYMENTS SECTION (Always show full pending list) */}
        <section className="mb-12 border-t-4 border-yellow-500 pt-4">
          <h2 className="text-3xl font-black mb-4 text-black flex items-center"><CreditCard className="mr-2"/> Pending Payments</h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black text-white uppercase text-sm font-bold">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {data.payments.filter((p:any) => p.status === 'pending').map((pay: any) => (
                  <tr key={pay._id} className="hover:bg-yellow-50">
                    <td className="p-4 font-bold">{pay.userId?.firstName} {pay.userId?.lastName}</td>
                    <td className="p-4 font-mono">{pay.transactionId}</td>
                    <td className="p-4"><span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-black">PENDING</span></td>
                    <td className="p-4 flex gap-2">
                       <form action={approvePayment}><input type="hidden" name="paymentId" value={pay._id} /><input type="hidden" name="userId" value={pay.userId?._id} /><button className="bg-green-700 text-white px-3 py-1 rounded font-bold">Approve</button></form>
                       <form action={rejectPayment}><input type="hidden" name="paymentId" value={pay._id} /><button className="bg-red-600 text-white px-3 py-1 rounded font-bold">Reject</button></form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.payments.filter((p:any) => p.status === 'pending').length === 0 && <div className="p-6 text-center text-gray-500 font-bold">No pending payments. Good job!</div>}
          </div>
        </section>

        {/* 2. RECENT STUDENTS (Limit 5) */}
        <section className="mb-12 border-t-4 border-blue-500 pt-4">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-3xl font-black text-black">Newest Students</h2>
             <Link href="/students" className="flex items-center text-blue-700 font-black hover:underline">View All Students <ArrowRight size={16} className="ml-1"/></Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black text-white uppercase text-sm font-bold">
                <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody>
                {data.users.map((user: any) => (
                  <UserRow key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. RECENT RIDES (Limit 6) */}
        <section className="mb-12 border-t-4 border-green-500 pt-4">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-3xl font-black text-black">Recent Rides</h2>
             <Link href="/rides" className="flex items-center text-green-700 font-black hover:underline">View All Rides <ArrowRight size={16} className="ml-1"/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.rides.map((ride: any) => (
              <div key={ride._id} className="bg-white p-5 rounded-lg shadow-md border-2 border-gray-300">
                <div className="flex justify-between mb-2">
                   <span className="bg-gray-200 text-black px-2 py-1 rounded text-xs font-black uppercase">{ride.status}</span>
                   <span className="text-green-700 font-black">{ride.fare} PKR</span>
                </div>
                <div className="font-black text-lg">{ride.from} ➜ {ride.to}</div>
                <div className="text-xs text-gray-500 font-bold mt-2" suppressHydrationWarning>{new Date(ride.datetime).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200 flex items-center space-x-4">
      <div className={`p-4 rounded-lg text-white shadow-sm ${color}`}>{icon}</div>
      <div>
        <div className="text-gray-600 font-black text-xs uppercase tracking-widest">{title}</div>
        <div className="text-4xl font-black text-black mt-1">{value}</div>
      </div>
    </div>
  )
}
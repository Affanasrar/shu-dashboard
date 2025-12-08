import connectDB from '@/lib/db';
import User from '@/models/User';
import PaymentRequest from '@/models/PaymentRequest';
import Ride from '@/models/Ride';
import Complaint from '@/models/Complaint';
import Vehicle from '@/models/Vehicle';
import { approvePayment, rejectPayment, deleteUser } from './actions';
import { LayoutDashboard, Users, CreditCard, Car, MessageSquare, ShieldCheck, XCircle, CheckCircle } from 'lucide-react';

// Interface for StatCard
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

// Fetch Data
async function getDashboardData() {
  await connectDB();
  
  const [users, payments, rides, complaints, vehicles] = await Promise.all([
    User.find({}).sort({ createdAt: -1 }).lean(),
    PaymentRequest.find({}).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).lean(),
    Ride.find({}).populate('driver', 'firstName lastName').sort({ createdAt: -1 }).lean(),
    Complaint.find({}).sort({ createdAt: -1 }).lean(),
    Vehicle.find({}).populate('user', 'firstName lastName').lean()
  ]);

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));
  
  return { 
    users: serialize(users), 
    payments: serialize(payments), 
    rides: serialize(rides), 
    complaints: serialize(complaints),
    vehicles: serialize(vehicles)
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      {/* Sidebar - Dark for contrast */}
      <aside className="w-64 bg-black text-white fixed h-full hidden md:block border-r border-gray-800">
        <div className="p-6 text-2xl font-black tracking-wider text-green-400">SHU ADMIN</div>
        <nav className="mt-6 space-y-2 px-4">
          <a href="#overview" className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800"><LayoutDashboard size={20} /> <span className="font-bold">Overview</span></a>
          <a href="#payments" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg text-yellow-400 font-bold"><CreditCard size={20} /> <span>Payments</span></a>
          <a href="#users" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><Users size={20} /> <span>Students</span></a>
          <a href="#rides" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><Car size={20} /> <span>Rides</span></a>
          <a href="#complaints" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg font-bold"><MessageSquare size={20} /> <span>Complaints</span></a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 bg-gray-50">
        
        {/* Stats Row */}
        <section id="overview" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={data.users.length} icon={<Users />} color="bg-blue-600" />
          <StatCard title="Pending Payments" value={data.payments.filter((p: any) => p.status === 'pending').length} icon={<CreditCard />} color="bg-yellow-600" />
          <StatCard title="Active Rides" value={data.rides.filter((r: any) => r.status === 'pending').length} icon={<Car />} color="bg-green-600" />
          <StatCard title="Complaints" value={data.complaints.length} icon={<MessageSquare />} color="bg-red-600" />
        </section>

        {/* 1. PAYMENTS SECTION */}
        <section id="payments" className="mb-12 border-t-4 border-yellow-500 pt-4">
          <h2 className="text-3xl font-black mb-4 text-black flex items-center"><CreditCard className="mr-2"/> Payment Approvals</h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
            <table className="w-full text-left">
              {/* HIGH CONTRAST HEADER: Black Background, White Text */}
              <thead className="bg-black text-white uppercase text-sm font-bold">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Proof</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {data.payments.map((pay: any) => (
                  <tr key={pay._id} className="hover:bg-yellow-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-lg text-black">{pay.userId?.firstName} {pay.userId?.lastName}</div>
                      <div className="text-sm font-semibold text-blue-800">{pay.userId?.email}</div>
                    </td>
                    <td className="p-4 font-mono text-base font-bold text-gray-800">{pay.transactionId}</td>
                    <td className="p-4">
                      {pay.proofImage ? (
                        <a href={pay.proofImage} target="_blank" className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-800">View Image</a>
                      ) : <span className="text-red-600 font-bold">No Image</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-black border ${
                        pay.status === 'approved' ? 'bg-green-200 text-green-900 border-green-400' : 
                        pay.status === 'rejected' ? 'bg-red-200 text-red-900 border-red-400' : 'bg-yellow-200 text-yellow-900 border-yellow-400'
                      }`}>
                        {pay.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {pay.status === 'pending' && (
                        <>
                          <form action={approvePayment}>
                            <input type="hidden" name="paymentId" value={pay._id} />
                            <input type="hidden" name="userId" value={pay.userId?._id} />
                            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-bold shadow-md">Approve</button>
                          </form>
                          <form action={rejectPayment}>
                            <input type="hidden" name="paymentId" value={pay._id} />
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow-md">Reject</button>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.payments.length === 0 && <div className="p-8 text-center text-black font-bold text-lg">No payment requests found.</div>}
          </div>
        </section>

        {/* 2. USERS SECTION */}
        <section id="users" className="mb-12 border-t-4 border-blue-500 pt-4">
          <h2 className="text-3xl font-black mb-4 text-black flex items-center"><Users className="mr-2"/> Students</h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              {/* HIGH CONTRAST HEADER */}
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
                {data.users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-blue-50">
                    <td className="p-4 font-bold text-black text-lg">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4 text-gray-900 font-medium">{user.email}</td>
                    <td className="p-4">
                      {user.isPremium ? 
                        <span className="text-green-800 font-black text-sm bg-green-200 px-2 py-1 rounded border border-green-400">PREMIUM MEMBER</span> : 
                        <span className="text-gray-800 font-bold text-sm bg-gray-200 px-2 py-1 rounded border border-gray-400">FREE TIER</span>
                      }
                    </td>
                    <td className="p-4 font-bold text-black">{user.ridesCompleted}</td>
                    <td className="p-4">
                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={user._id} />
                        <button className="text-red-600 hover:text-red-900 font-bold underline">Delete User</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. RIDES SECTION */}
        <section id="rides" className="mb-12 border-t-4 border-green-500 pt-4">
          <h2 className="text-3xl font-black mb-4 text-black">Recent Rides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.rides.map((ride: any) => (
              <div key={ride._id} className="bg-white p-5 rounded-lg shadow-md border-2 border-gray-300 hover:border-black transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2 py-1 rounded font-black uppercase ${ride.status === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
                    {ride.status}
                  </span>
                  <span className="text-lg font-black text-green-700 bg-green-100 px-2 rounded">{ride.fare} PKR</span>
                </div>
                
                {/* Route - Very Dark */}
                <div className="font-black text-xl text-black mb-2">{ride.from} <span className="text-gray-400">➜</span> {ride.to}</div>
                
                {/* Driver Info - Dark Gray */}
                <div className="text-base text-gray-900 font-bold border-t border-gray-200 pt-2 mt-2">
                  Driver: <span className="text-blue-800">{ride.driver?.firstName || 'Unknown'}</span>
                </div>
                
                {/* Date - Dark Gray with Suppression */}
                <div className="text-sm text-gray-700 font-semibold mt-1" suppressHydrationWarning>
                  {new Date(ride.datetime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. COMPLAINTS SECTION */}
        <section id="complaints" className="mb-12 border-t-4 border-red-500 pt-4">
          <h2 className="text-3xl font-black mb-4 text-black">Complaints</h2>
          <div className="space-y-4">
            {data.complaints.map((comp: any) => (
              <div key={comp._id} className="bg-white p-6 rounded-lg shadow-sm border-l-8 border-red-600 ring-1 ring-gray-300">
                <h3 className="font-black text-black text-xl mb-2">{comp.subject}</h3>
                <p className="text-gray-900 font-medium text-lg leading-relaxed">{comp.description}</p>
                <div className="text-sm text-gray-700 mt-4 pt-3 border-t border-gray-200 font-bold" suppressHydrationWarning>
                  From: <span className="text-black">{comp.name || 'Anonymous'}</span> ({comp.email}) 
                  <span className="float-right text-gray-600">{new Date(comp.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

// Stat Card Component - High Contrast
function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200 flex items-center space-x-4">
      <div className={`p-4 rounded-lg text-white shadow-sm ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-600 font-black text-xs uppercase tracking-widest">{title}</div>
        <div className="text-4xl font-black text-black mt-1">{value}</div>
      </div>
    </div>
  )
}
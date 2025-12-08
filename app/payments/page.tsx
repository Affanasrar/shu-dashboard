import connectDB from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import { approvePayment, rejectPayment } from '../actions'; // Re-use your actions
import Link from 'next/link';
import { ArrowLeft, CreditCard, CheckCircle, XCircle } from 'lucide-react';

export default async function AllPaymentsPage() {
  await connectDB();
  const payments = await PaymentRequest.find({})
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();
    
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-black">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-gray-600 font-bold hover:text-black mb-4"><ArrowLeft size={16} className="mr-2"/> Back to Dashboard</Link>
        <h1 className="text-4xl font-black text-black flex items-center gap-3">
            <CreditCard size={40} className="text-yellow-600"/> Payment History ({payments.length})
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black text-white uppercase text-sm font-bold">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Student</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Proof</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {serialize(payments).map((pay: any) => (
              <tr key={pay._id} className="hover:bg-gray-50">
                <td className="p-4 text-xs font-bold text-gray-500" suppressHydrationWarning>
                    {new Date(pay.createdAt).toLocaleDateString()} <br/>
                    {new Date(pay.createdAt).toLocaleTimeString()}
                </td>
                <td className="p-4">
                  <div className="font-bold text-black">{pay.userId?.firstName} {pay.userId?.lastName}</div>
                  <div className="text-xs text-gray-600">{pay.userId?.email}</div>
                </td>
                <td className="p-4 font-mono font-bold text-gray-700">{pay.transactionId}</td>
                <td className="p-4">
                  {pay.proofImage ? (
                    <a href={pay.proofImage} target="_blank" className="text-blue-600 font-bold underline hover:text-blue-800 text-sm">View Proof</a>
                  ) : <span className="text-gray-400 italic text-sm">No Image</span>}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                    pay.status === 'approved' ? 'bg-green-100 text-green-900 border-green-300' : 
                    pay.status === 'rejected' ? 'bg-red-100 text-red-900 border-red-300' : 'bg-yellow-100 text-yellow-900 border-yellow-300'
                  }`}>
                    {pay.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {pay.status === 'pending' ? (
                    <div className="flex gap-2">
                       <form action={approvePayment}>
                           <input type="hidden" name="paymentId" value={pay._id} />
                           <input type="hidden" name="userId" value={pay.userId?._id} />
                           <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded shadow" title="Approve">
                               <CheckCircle size={16}/>
                           </button>
                       </form>
                       <form action={rejectPayment}>
                           <input type="hidden" name="paymentId" value={pay._id} />
                           <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded shadow" title="Reject">
                               <XCircle size={16}/>
                           </button>
                       </form>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs font-bold">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
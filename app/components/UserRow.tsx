'use client';

import { useState } from 'react';
import { deleteUser } from '../actions';
import { X, Phone, Mail, Building, Shield, Calendar, User as UserIcon } from 'lucide-react';

export default function UserRow({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <tr className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-300" onClick={() => setIsOpen(true)}>
      <td className="p-4">
        <div className="font-bold text-black text-lg flex items-center gap-3">
            <img src={user.img} alt="avatar" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
            <div>
              {user.firstName} {user.lastName}
              <div className="text-xs font-normal text-gray-600">Click to view details</div>
            </div>
        </div>
      </td>
      <td className="p-4 text-gray-900 font-medium">{user.email}</td>
      <td className="p-4">
        {user.isPremium ? 
          <span className="text-green-900 font-black text-xs bg-green-200 px-2 py-1 rounded border border-green-400">PREMIUM</span> : 
          <span className="text-gray-900 font-bold text-xs bg-gray-200 px-2 py-1 rounded border border-gray-400">FREE TIER</span>
        }
      </td>
      <td className="p-4 font-bold text-black">{user.ridesCompleted}</td>
      
      {/* --- MODAL IS NOW INSIDE THIS TD --- */}
      <td className="p-4" onClick={(e) => e.stopPropagation()}>
        <form action={deleteUser}>
          <input type="hidden" name="userId" value={user._id} />
          <button className="text-red-600 hover:text-red-900 font-bold underline text-sm">Delete</button>
        </form>

        {/* THE MODAL (Moved inside TD to fix Hydration Error) */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 cursor-default" onClick={(e) => {
            e.stopPropagation(); // Stop click from triggering the row
            setIsOpen(false);
          }}>
            
            {/* Modal Content */}
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div className="bg-black p-6 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img src={user.img} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white object-cover bg-white" />
                  <div>
                    <h2 className="text-2xl font-black text-white">{user.firstName} {user.lastName}</h2>
                    <p className="text-gray-400 font-medium">{user.department}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                  <X size={32} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-black font-black text-lg border-b border-gray-200 pb-2 mb-4">Contact Details</h3>
                  
                  <div className="flex items-center gap-3 text-gray-800">
                    <Mail className="text-blue-600" size={20} />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase">Email</span>
                      <span className="font-bold">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-800">
                    <Phone className="text-green-600" size={20} />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase">Phone</span>
                      <span className="font-bold">{user.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-800">
                    <Building className="text-purple-600" size={20} />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase">Department</span>
                      <span className="font-bold">{user.department}</span>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-4">
                  <h3 className="text-black font-black text-lg border-b border-gray-200 pb-2 mb-4">Account Status</h3>
                  
                  <div className="flex items-center gap-3">
                    <Shield className={user.isPremium ? "text-green-600" : "text-gray-400"} size={20} />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase">Membership</span>
                      {user.isPremium ? 
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-bold">Premium Member</span> : 
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm font-bold">Free Tier</span>
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserIcon className="text-blue-600" size={20} />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase">Role</span>
                      <span className="font-bold capitalize">{user.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="text-orange-600" size={20} />
                    <div>
                      <span className="block text-xs text-gray-500 font-bold uppercase">Joined Date</span>
                      <span className="font-bold" suppressHydrationWarning>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
                  <span className="text-gray-500 text-sm font-bold">User ID: {user._id}</span>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
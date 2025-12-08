'use server';

import connectDB from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

// We use 'formData: FormData' to fix the TypeScript error
export async function approvePayment(formData: FormData) {
  const paymentId = formData.get('paymentId');
  const userId = formData.get('userId');

  await connectDB();

  // 1. Update Payment Status
  await PaymentRequest.findByIdAndUpdate(paymentId, {
    status: 'approved',
    reviewedAt: new Date()
  });

  // 2. Upgrade User to Premium
  await User.findByIdAndUpdate(userId, {
    isPremium: true
  });

  revalidatePath('/'); // Refresh the page data
}

export async function rejectPayment(formData: FormData) {
  const paymentId = formData.get('paymentId');
  
  await connectDB();
  await PaymentRequest.findByIdAndUpdate(paymentId, {
    status: 'rejected',
    reviewedAt: new Date()
  });

  revalidatePath('/');
}

export async function deleteUser(formData: FormData) {
  const userId = formData.get('userId');
  await connectDB();
  await User.findByIdAndDelete(userId);
  revalidatePath('/');
}
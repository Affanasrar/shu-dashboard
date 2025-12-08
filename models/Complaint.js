import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  name: { type: String },
  email: { type: String, lowercase: true }
},{ timestamps: true });

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
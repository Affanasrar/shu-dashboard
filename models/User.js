import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["user", "Admin"], default: "user" },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  img: { type: String, required: true },
  department: { type: String, required: true },
  ridesCompleted: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

// Note: Removed methods/bcrypt for Admin Dashboard to keep it lightweight
export default mongoose.models.User || mongoose.model('User', userSchema);
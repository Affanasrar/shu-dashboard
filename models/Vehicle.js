import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleType: { type: String, enum: ["car", "bike"], required: true },
  numberPlate: { type: String, required: true },
  color: { type: String, required: true },
  model: { type: String, required: true }, 
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
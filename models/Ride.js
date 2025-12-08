import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  from: { type: String, required: true },
  to: { type: String, required: true },
  datetime: { type: Date, required: true },
  fare: { type: Number, required: true },
  seats: { type: Number, required: true },
  availableSeats: { type: Number, min: 0 },
  status: { type: String, enum: ["pending", "progress", "completed", "canceled"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.Ride || mongoose.model('Ride', RideSchema);
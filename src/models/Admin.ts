import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Admin document
export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// Mongoose Schema for Admin
const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// To prevent model recompilation error in Next.js dev mode
export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

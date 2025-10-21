import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Interface for the Merchant document
export interface IMerchant extends Document {
  name: string;
  email: string;
  passwordHash: string;
  publicKey: string;
  secretKey: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  sandboxMode: boolean;
  createdAt: Date;
  transactions: mongoose.Types.ObjectId[]; // Array of Transaction ObjectIds
}

// Mongoose Schema for Merchant
const MerchantSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Merchant name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    publicKey: {
      type: String,
      unique: true,
      default: () => `pk_test_${uuidv4().replace(/-/g, "")}`,
    },
    secretKey: {
      type: String,
      unique: true,
      default: () => `sk_test_${uuidv4().replace(/-/g, "")}`,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      required: false,
    },
    sandboxMode: {
      type: Boolean,
      default: true, // Start in sandbox mode by default
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// To prevent model recompilation error in Next.js dev mode
export default mongoose.models.Merchant ||
  mongoose.model<IMerchant>("Merchant", MerchantSchema);

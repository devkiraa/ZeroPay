import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define possible payment statuses
type PaymentStatus = "pending" | "success" | "failed" | "refunded";
type PaymentMethod = "card" | "upi" | "wallet" | "netbanking";

// Interface for the Transaction document
export interface ITransaction extends Document {
  merchantId: mongoose.Types.ObjectId; // Reference to the Merchant
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  orderId: string; // Our internal unique order ID
  customerEmail: string;
  isTestMode: boolean; // Whether this is a test transaction
  hasDispute: boolean; // Whether this transaction has an open dispute
  createdAt: Date;
  refundedAmount?: number;
  refundReason?: string;
  refundDate?: Date;
}

// Mongoose Schema for Transaction
const TransactionSchema: Schema = new Schema(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant", // Creates a reference to the Merchant model
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["card", "upi", "wallet", "netbanking"],
      required: [true, "Payment method is required"],
    },
    orderId: {
      type: String,
      unique: true,
      default: () => `order_${uuidv4().replace(/-/g, "")}`,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
    },
    isTestMode: {
      type: Boolean,
      default: false,
    },
    hasDispute: {
      type: Boolean,
      default: false,
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
      default: "",
    },
    refundDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// To prevent model recompilation error in Next.js dev mode
export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

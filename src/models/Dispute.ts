import mongoose, { Schema, Document } from "mongoose";

type DisputeStatus = "open" | "under_review" | "resolved" | "won" | "lost";
type DisputeReason =
  | "fraudulent"
  | "unrecognized"
  | "duplicate"
  | "product_not_received"
  | "product_unacceptable"
  | "credit_not_processed"
  | "other";

export interface IDispute extends Document {
  transactionId: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  orderId: string;
  amount: number;
  reason: DisputeReason;
  status: DisputeStatus;
  customerEmail: string;
  customerMessage: string;
  merchantResponse?: string;
  evidence?: {
    description?: string;
    documents?: string[]; // URLs to uploaded documents
    shippingTracking?: string;
    refundPolicy?: string;
  };
  resolution?: {
    decision: "merchant" | "customer";
    resolvedBy: string; // admin email
    resolvedAt: Date;
    notes: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema: Schema = new Schema(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "fraudulent",
        "unrecognized",
        "duplicate",
        "product_not_received",
        "product_unacceptable",
        "credit_not_processed",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "won", "lost"],
      default: "open",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerMessage: {
      type: String,
      required: true,
    },
    merchantResponse: {
      type: String,
      default: "",
    },
    evidence: {
      description: String,
      documents: [String],
      shippingTracking: String,
      refundPolicy: String,
    },
    resolution: {
      decision: {
        type: String,
        enum: ["merchant", "customer"],
      },
      resolvedBy: String,
      resolvedAt: Date,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Dispute ||
  mongoose.model<IDispute>("Dispute", DisputeSchema);

import mongoose, { Schema, Document } from 'mongoose';

// Define possible webhook events
type WebhookEvent = 'payment.success' | 'payment.failed' | 'payment.refunded';

export interface IWebhook extends Document {
  merchantId: mongoose.Types.ObjectId;
  url: string;
  secret: string; // A secret for verifying the webhook's origin
  events: WebhookEvent[];
  createdAt: Date;
}

const WebhookSchema: Schema = new Schema(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
    url: {
      type: String,
      required: [true, 'Webhook URL is required'],
    },
    secret: {
      type: String,
      // Generate a simple secret, in a real app this would be more robust
      default: () => `whsec_${new Date().getTime().toString(36)}`,
    },
    events: [
      {
        type: String,
        enum: ['payment.success', 'payment.failed', 'payment.refunded'],
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Webhook ||
  mongoose.model<IWebhook>('Webhook', WebhookSchema);
import nodemailer from "nodemailer";

// Email configuration - uses environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  // If SMTP is not configured, log the email instead of sending
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📧 Email would be sent (SMTP not configured):");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text || html}`);
    return { success: true, message: "Email logged (SMTP not configured)" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"ZeroPay" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// Template for welcome email
export function getWelcomeEmailContent(
  merchantName: string,
  publicKey: string
) {
  return {
    subject: "Welcome to ZeroPay! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Welcome to ZeroPay!</h1>
        <p>Hi <strong>${merchantName}</strong>,</p>
        <p>Thank you for signing up with ZeroPay. Your account has been successfully created!</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <h2 style="margin-top: 0; color: #374151;">Your API Keys</h2>
          <p style="margin: 8px 0;">
            <strong>Public Key:</strong><br/>
            <code style="background-color: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 4px;">${publicKey}</code>
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 12px;">
            ⚠️ Your secret key is available in your dashboard. Keep it secure and never share it publicly.
          </p>
        </div>

        <h3 style="color: #374151;">Getting Started</h3>
        <ol style="line-height: 1.8;">
          <li>Log in to your dashboard</li>
          <li>Copy your secret key from the API Keys page</li>
          <li>Start creating payment orders via our API</li>
          <li>Monitor transactions in real-time</li>
        </ol>

        <p>Need help? Check out our documentation or contact support.</p>
        
        <p style="margin-top: 32px;">
          Best regards,<br/>
          <strong>The ZeroPay Team</strong>
        </p>
      </div>
    `,
    text: `
Welcome to ZeroPay!

Hi ${merchantName},

Thank you for signing up with ZeroPay. Your account has been successfully created!

Your Public Key: ${publicKey}
(Your secret key is available in your dashboard)

Getting Started:
1. Log in to your dashboard
2. Copy your secret key from the API Keys page
3. Start creating payment orders via our API
4. Monitor transactions in real-time

Best regards,
The ZeroPay Team
    `.trim(),
  };
}

// Template for payment success email
export function getPaymentSuccessEmailContent(
  orderId: string,
  amount: number,
  currency: string,
  customerEmail: string
) {
  return {
    subject: "Payment Successful - ZeroPay",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">✅ Payment Successful</h1>
        <p>Dear Customer,</p>
        <p>Your payment has been processed successfully!</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <h2 style="margin-top: 0; color: #374151;">Payment Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${currency} ${amount.toFixed(
      2
    )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Customer Email:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="background-color: #059669; color: white; padding: 4px 12px; border-radius: 4px;">Success</span>
              </td>
            </tr>
          </table>
        </div>

        <p>If you have any questions about this transaction, please contact the merchant.</p>
        
        <p style="margin-top: 32px;">
          Thank you for using ZeroPay!<br/>
          <strong>The ZeroPay Team</strong>
        </p>
      </div>
    `,
    text: `
Payment Successful

Dear Customer,

Your payment has been processed successfully!

Payment Details:
- Order ID: ${orderId}
- Amount: ${currency} ${amount.toFixed(2)}
- Customer Email: ${customerEmail}
- Status: Success

If you have any questions about this transaction, please contact the merchant.

Thank you for using ZeroPay!
The ZeroPay Team
    `.trim(),
  };
}

// Template for refund notification email
export function getRefundEmailContent(
  orderId: string,
  amount: number,
  currency: string,
  reason: string,
  customerEmail: string
) {
  return {
    subject: "Refund Processed - ZeroPay",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">💰 Refund Processed</h1>
        <p>Dear Customer,</p>
        <p>Your refund has been processed successfully and will be credited to your original payment method within 5-7 business days.</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <h2 style="margin-top: 0; color: #374151;">Refund Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Refund Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${currency} ${amount.toFixed(
      2
    )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Customer Email:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Reason:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${reason}</td>
            </tr>
          </table>
        </div>

        <p>If you have any questions about this refund, please contact the merchant.</p>
        
        <p style="margin-top: 32px;">
          Thank you for your patience.<br/>
          <strong>The ZeroPay Team</strong>
        </p>
      </div>
    `,
    text: `
Refund Processed

Dear Customer,

Your refund has been processed successfully and will be credited to your original payment method within 5-7 business days.

Refund Details:
- Order ID: ${orderId}
- Refund Amount: ${currency} ${amount.toFixed(2)}
- Customer Email: ${customerEmail}
- Reason: ${reason}

If you have any questions about this refund, please contact the merchant.

Thank you for your patience.
The ZeroPay Team
    `.trim(),
  };
}

// Template for dispute created notification (to merchant)
export function getDisputeCreatedEmailContent(
  merchantName: string,
  orderId: string,
  amount: number,
  reason: string,
  customerMessage: string
) {
  return {
    subject: "⚠️ New Dispute Filed - Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">⚠️ Dispute Filed</h1>
        <p>Hi <strong>${merchantName}</strong>,</p>
        <p>A customer has filed a dispute for one of your transactions. Please review and respond as soon as possible.</p>
        
        <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #ef4444;">
          <h2 style="margin-top: 0; color: #991b1b;">Dispute Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right;">₹${amount.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Reason:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${reason}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #fecaca;">
            <strong style="color: #991b1b;">Customer Message:</strong>
            <p style="margin: 8px 0; color: #7f1d1d;">"${customerMessage}"</p>
          </div>
        </div>

        <div style="background-color: #fffbeb; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #92400e;">⏰ Action Required</h3>
          <p style="margin: 0; color: #78350f;">Please respond to this dispute within 7 days with evidence to support your case. Login to your dashboard to submit your response.</p>
        </div>
        
        <p style="margin-top: 32px;">
          Best regards,<br/>
          <strong>The ZeroPay Team</strong>
        </p>
      </div>
    `,
    text: `
⚠️ Dispute Filed

Hi ${merchantName},

A customer has filed a dispute for one of your transactions. Please review and respond as soon as possible.

Dispute Details:
- Order ID: ${orderId}
- Amount: ₹${amount.toFixed(2)}
- Reason: ${reason}
- Customer Message: "${customerMessage}"

⏰ Action Required:
Please respond to this dispute within 7 days with evidence to support your case. Login to your dashboard to submit your response.

Best regards,
The ZeroPay Team
    `.trim(),
  };
}

// Template for dispute resolved notification (to merchant)
export function getDisputeResolvedEmailContent(
  merchantName: string,
  orderId: string,
  amount: number,
  decision: "merchant" | "customer",
  notes: string
) {
  const won = decision === "merchant";
  return {
    subject: won
      ? "✅ Dispute Resolved - You Won!"
      : "❌ Dispute Resolved - Customer Won",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${won ? "#059669" : "#ef4444"};">
          ${won ? "✅ Dispute Won!" : "❌ Dispute Lost"}
        </h1>
        <p>Hi <strong>${merchantName}</strong>,</p>
        <p>The dispute for order <strong>${orderId}</strong> has been resolved.</p>
        
        <div style="background-color: ${
          won ? "#f0fdf4" : "#fef2f2"
        }; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid ${
      won ? "#059669" : "#ef4444"
    };">
          <h2 style="margin-top: 0; color: ${
            won ? "#065f46" : "#991b1b"
          };">Resolution Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right;">₹${amount.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Decision:</strong></td>
              <td style="padding: 8px 0; text-align: right;">
                <strong style="color: ${won ? "#059669" : "#ef4444"};">${
      won ? "Merchant Wins" : "Customer Wins"
    }</strong>
              </td>
            </tr>
          </table>
          ${
            notes
              ? `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid ${
              won ? "#bbf7d0" : "#fecaca"
            };">
              <strong>Admin Notes:</strong>
              <p style="margin: 8px 0;">${notes}</p>
            </div>
          `
              : ""
          }
        </div>

        ${
          won
            ? `
          <p style="color: #065f46;">The funds will remain in your account. Thank you for providing evidence to support your case.</p>
        `
            : `
          <p style="color: #991b1b;">The transaction amount has been refunded to the customer. If you have questions about this decision, please contact support.</p>
        `
        }
        
        <p style="margin-top: 32px;">
          Best regards,<br/>
          <strong>The ZeroPay Team</strong>
        </p>
      </div>
    `,
    text: `
${won ? "✅ Dispute Won!" : "❌ Dispute Lost"}

Hi ${merchantName},

The dispute for order ${orderId} has been resolved.

Resolution Details:
- Order ID: ${orderId}
- Amount: ₹${amount.toFixed(2)}
- Decision: ${won ? "Merchant Wins" : "Customer Wins"}
${notes ? `- Admin Notes: ${notes}` : ""}

${
  won
    ? "The funds will remain in your account. Thank you for providing evidence to support your case."
    : "The transaction amount has been refunded to the customer. If you have questions about this decision, please contact support."
}

Best regards,
The ZeroPay Team
    `.trim(),
  };
}

// Template for payment failed notification
export function getPaymentFailedEmailContent(
  orderId: string,
  amount: number,
  currency: string,
  customerEmail: string
) {
  return {
    subject: "Payment Failed - ZeroPay",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">❌ Payment Failed</h1>
        <p>Dear Customer,</p>
        <p>We were unable to process your payment. Please try again or use a different payment method.</p>
        
        <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <h2 style="margin-top: 0; color: #991b1b;">Transaction Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${currency} ${amount.toFixed(
      2
    )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Customer Email:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="background-color: #ef4444; color: white; padding: 4px 12px; border-radius: 4px;">Failed</span>
              </td>
            </tr>
          </table>
        </div>

        <p>Common reasons for payment failure:</p>
        <ul style="line-height: 1.8;">
          <li>Insufficient funds</li>
          <li>Invalid card details</li>
          <li>Payment method declined</li>
          <li>Network connection issues</li>
        </ul>

        <p>If the problem persists, please contact your bank or the merchant.</p>
        
        <p style="margin-top: 32px;">
          <strong>The ZeroPay Team</strong>
        </p>
      </div>
    `,
    text: `
Payment Failed

Dear Customer,

We were unable to process your payment. Please try again or use a different payment method.

Transaction Details:
- Order ID: ${orderId}
- Amount: ${currency} ${amount.toFixed(2)}
- Customer Email: ${customerEmail}
- Status: Failed

Common reasons for payment failure:
- Insufficient funds
- Invalid card details
- Payment method declined
- Network connection issues

If the problem persists, please contact your bank or the merchant.

The ZeroPay Team
    `.trim(),
  };
}

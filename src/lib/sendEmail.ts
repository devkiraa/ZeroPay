import nodemailer from 'nodemailer';

// Email configuration - uses environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
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
    console.log('📧 Email would be sent (SMTP not configured):');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text || html}`);
    return { success: true, message: 'Email logged (SMTP not configured)' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"ZeroPay" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Template for welcome email
export function getWelcomeEmailContent(merchantName: string, publicKey: string) {
  return {
    subject: 'Welcome to ZeroPay! 🎉',
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
    subject: 'Payment Successful - ZeroPay',
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
              <td style="padding: 8px 0; text-align: right;">${currency} ${amount.toFixed(2)}</td>
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

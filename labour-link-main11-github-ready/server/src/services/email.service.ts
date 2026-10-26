import { Resend } from 'resend';
import { logger } from '../utils/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (
  email: string,
  name: string,
  otp: string
): Promise<void> => {
  try {
    const { error } = await resend.emails.send({
      from: 'kaaragir <noreply@kaaragir.in>',
      to: [email],
      subject: 'Your Kaaragir OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Kaaragir</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hello ${name}!</h2>
            <p style="color: #666;">Your OTP verification code is:</p>
            <div style="background: white; border: 2px dashed #2563EB; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2563EB; font-size: 48px; letter-spacing: 10px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
          </div>
        </div>
      `
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info(`OTP email sent to ${email}`);
  } catch (error: any) {
    logger.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error?.message}`);
  }
};

export const sendBookingConfirmationEmail = async (
  email: string,
  name: string,
  bookingNumber: string,
  serviceName: string
): Promise<void> => {
  try {
    const { error } = await resend.emails.send({
      from: 'kaaragir <noreply@kaaragir.in>',
      to: [email],
      subject: `Booking Confirmed - ${bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Labour Link</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Booking Confirmed!</h2>
            <p style="color: #666;">Hi ${name}, your booking has been confirmed.</p>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p><strong>Booking Number:</strong> ${bookingNumber}</p>
              <p><strong>Service:</strong> ${serviceName}</p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    logger.error('Email send error:', error);
  }
};
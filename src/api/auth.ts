/**
 * Auth API – OTP and login.
 * Mock path below; replace with actual endpoint when ready.
 */
import { request } from "./client";

/** Send OTP endpoint – update path when backend is ready */
const SEND_OTP_PATH = "auth/send-otp";

/** Verify OTP endpoint – update path when backend is ready */
const VERIFY_OTP_PATH = "auth/verify-otp";

export interface SendOtpBody {
  mobile: string;
}

export interface SendOtpResponse {
  success?: boolean;
  message?: string;
}

export interface VerifyOtpBody {
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  message?: string;
}

export async function sendOtp(mobile: string) {
  return request<SendOtpResponse>({
    method: "POST",
    path: SEND_OTP_PATH,
    body: { mobile } as SendOtpBody,
  });
}

export async function verifyOtp(mobile: string, otp: string) {
  return request<VerifyOtpResponse>({
    method: "POST",
    path: VERIFY_OTP_PATH,
    body: { mobile, otp } as VerifyOtpBody,
  });
}

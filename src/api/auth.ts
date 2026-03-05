/**
 * Auth API – OTP and login.
 * Mock path below; replace with actual endpoint when ready.
 */
import { request } from "./client";

/** Send OTP endpoint – matches /api/election/auth/sendOTP */
const SEND_OTP_PATH = "auth/sendOTP";

/** Verify OTP endpoint – matches /api/election/auth/verifyOTP */
const VERIFY_OTP_PATH = "auth/verifyOTP";

export interface SendOtpBody {
  phoneNumber: string;
}

export interface SendOtpResponse {
  ChallengeName?: string;
  ChallengeParameters?: {
    USERNAME?: string;
    challengeType?: string;
  };
  Session?: string;
  session?: string;
  /** Some backends wrap the payload */
  data?: SendOtpResponse;
  result?: SendOtpResponse;
}

export interface VerifyOtpBody {
  phoneNumber: string;
  otpAnswer: string;
  session: string;
}

/** verifyOTP API success response – agent/user data, available globally via AuthContext. */
export interface VerifyOtpResponse {
  agentId: number;
  agentName: string;
  agentMobile: string;
  roleId: number;
  roleName: string;
  flag: number;
  activeFlag: number;
  stateId: number;
  stateName: string;
  districtId: number;
  districtName: string;
  consId: number;
  consName: string;
  createDate: string;
  createdUser: string;
  lastUpdatedDate: string | null;
  updatedUser: string | null;
}

/** Sends OTP to the given Indian mobile (10 digits). 
 * Request uses phoneNumber with country code 91. */
export async function sendOtp(mobile: string) {
  const phoneNumber = mobile.startsWith("91") ? mobile : `91${mobile}`;
  return request<SendOtpResponse>({
    method: "POST",
    path: SEND_OTP_PATH,
    body: { phoneNumber } as SendOtpBody,
  });
}

/** Verifies OTP with the backend. Requires session from sendOTP response. */
export async function verifyOtp(mobile: string, otp: string, session: string) {
  const phoneNumber = mobile.startsWith("91") ? mobile : `91${mobile}`;
  return request<VerifyOtpResponse>({
    method: "POST",
    path: VERIFY_OTP_PATH,
    body: {
      phoneNumber,
      otpAnswer: otp,
      session,
    } as VerifyOtpBody,
  });
}

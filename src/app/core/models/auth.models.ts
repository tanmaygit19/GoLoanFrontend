export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  roleId: number;
  age?: number;
  pan?: string;
  aadhaarNo?: string;
  employmentType?: string;
  monthlyIncome?: number;
  monthlyInvestment?: number;
}

export interface GoogleLoginDTO {
  idToken: string;
}

export interface VerifyOtpDTO {
  code: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenType?: string;
  tokenExpiry?: string;
  userId?: number;
  fullName?: string;
  email?: string;
  role?: string;
  customerId?: number;
  requiresTwoFactor?: boolean;
  requiresTwoFactorSetup?: boolean;
  preAuthToken?: string;
  qrCodeBase64?: string;
  tempSecret?: string;
}

export interface KycDocumentItem {
  documentId: number;
  documentType: string;
  filePath: string;
  verificationStatus: string;
}

export interface CustomerLoanItem {
  dealId: number;
  loanType: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  currentStatus: string;
  appliedDate: string;
}

export interface CustomerProfileData {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  age: number;
  pan: string;
  aadhaarNo: string;
  employmentType: string;
  monthlyIncome: number;
  monthlyInvestment: number;
  isEmailVerified: boolean;
  kycDocuments: KycDocumentItem[];
  cibilScore: number;
  loans: CustomerLoanItem[];
}

export interface CustomerProfileResponse {
  success: boolean;
  profile: CustomerProfileData;
  message?: string;
}

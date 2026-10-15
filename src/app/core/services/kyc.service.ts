import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface KycDocument {
  documentId: number;
  customerId: number;
  documentType: string;
  filePath: string;
  verificationStatus: string;
}

export interface CustomerKycResponse {
  success: boolean;
  isKycApproved: boolean;
  documents: KycDocument[];
}

export interface DocumentTypesResponse {
  success: boolean;
  data: string[];
}

export interface OfficerKycSummary {
  customerId: number;
  customerName: string;
  email: string;
  mobile: string;
  totalUploaded: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  status: string;
}

export interface OfficerCustomerDocs {
  customerId: number;
  customerName: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaarNo: string;
  documents: KycDocument[];
}

export interface BulkKycUpdateRequest {
  documentIds: number[];
  actionType: 'Approve' | 'Reject';
}

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/KycDocument`;
  private apiOrigin = environment.apiUrl.replace(/\/api\/?$/, '');

  /**
   * Fetch allowed KYC Document Types dynamically
   */
  getDocumentTypes(): Observable<DocumentTypesResponse> {
    return this.http.get<DocumentTypesResponse>(`${this.baseUrl}/DocumentTypes`);
  }

  getCustomerDocuments(customerId: number): Observable<CustomerKycResponse> {
    return this.http.get<CustomerKycResponse>(`${this.baseUrl}/Customer/${customerId}`);
  }

  uploadDocument(customerId: number, documentType: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('CustomerId', customerId.toString());
    formData.append('DocumentType', documentType);
    formData.append('File', file, file.name);

    return this.http.post<any>(`${this.baseUrl}/Upload`, formData);
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${documentId}`);
  }

  // --- Officer KYC Endpoints ---

  getOfficerKycList(): Observable<OfficerKycSummary[]> {
    return this.http.get<OfficerKycSummary[]>(`${this.baseUrl}/Officer/Index`);
  }

  getOfficerCustomerDocs(customerId: number): Observable<OfficerCustomerDocs> {
    return this.http.get<OfficerCustomerDocs>(`${this.baseUrl}/Officer/CustomerDocs/${customerId}`);
  }

  approveDocument(documentId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Approve/${documentId}`, {});
  }

  rejectDocument(documentId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Reject/${documentId}`, {});
  }

  bulkUpdateDocuments(req: BulkKycUpdateRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/BulkUpdate`, req);
  }

  getPdfUrl(filePath: string): string {
    if (!filePath) return '';
    return filePath.startsWith('http') ? filePath : `${this.apiOrigin}${filePath}`;
  }
}

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KycService, KycDocument } from '../../core/services/kyc.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-kyc-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-verification.html',
  styleUrl: './kyc-verification.scss'
})
export class KycVerification implements OnInit {
  private kycService = inject(KycService);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  documentTypes: string[] = [];
  selectedDocType: string = '';
  selectedFile: File | null = null;
  fileError: string = '';

  documents: KycDocument[] = [];
  isLoading = true;
  isUploading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadDocumentTypes();
    this.loadDocuments();
  }

  getCustomerId(): number {
    return this.authService.getUser()?.customerId || 1;
  }

  loadDocumentTypes(): void {
    this.kycService.getDocumentTypes().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.documentTypes = res.data;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load document types from API', err);
      }
    });
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.kycService.getCustomerDocuments(this.getCustomerId()).subscribe({
      next: (res) => {
        if (res.success && res.documents) {
          this.documents = res.documents;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  onFileSelected(event: any): void {
    this.fileError = '';
    const file = event.target.files?.[0];

    if (!file) {
      this.selectedFile = null;
      return;
    }

    // Strict PDF Only Validation
    const isPdfType = file.type === 'application/pdf';
    const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdfType && !isPdfExtension) {
      this.fileError = 'Invalid file format! Only PDF documents (.pdf) are allowed.';
      this.selectedFile = null;
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.fileError = 'File size exceeds 10 MB limit.';
      this.selectedFile = null;
      event.target.value = '';
      return;
    }

    this.selectedFile = file;
  }

  onUpload(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedDocType) {
      this.errorMessage = 'Please select a Document Type.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please choose a valid PDF file to upload.';
      return;
    }

    this.isUploading = true;
    this.kycService.uploadDocument(this.getCustomerId(), this.selectedDocType, this.selectedFile).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.successMessage = res.message || 'Document uploaded successfully!';
        this.selectedDocType = '';
        this.selectedFile = null;

        const fileInput = document.getElementById('kycFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        this.loadDocuments();
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err.error?.message || 'Failed to upload document. Ensure it is a valid PDF.';
        this.cd.detectChanges();
      }
    });
  }

  viewDocument(filePath: string): void {
    const url = this.kycService.getPdfUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    }
  }

  deleteDocument(doc: KycDocument): void {
    if (doc.verificationStatus === 'Approved') {
      alert('Approved documents cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${doc.documentType}?`)) {
      return;
    }

    this.kycService.deleteDocument(doc.documentId).subscribe({
      next: () => {
        this.successMessage = `${doc.documentType} deleted successfully.`;
        this.loadDocuments();
      },
      error: (err) => {
        alert(err.error?.message || 'Could not delete document.');
      }
    });
  }
}

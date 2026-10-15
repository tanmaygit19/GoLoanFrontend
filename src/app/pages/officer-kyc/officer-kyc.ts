import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KycService, OfficerKycSummary, OfficerCustomerDocs, KycDocument } from '../../core/services/kyc.service';

export interface SelectableKycDocument extends KycDocument {
  selected?: boolean;
}

export interface OfficerCustomerDocsWithSelection extends Omit<OfficerCustomerDocs, 'documents'> {
  documents: SelectableKycDocument[];
}

@Component({
  selector: 'app-officer-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-kyc.html',
  styleUrl: './officer-kyc.scss'
})
export class OfficerKyc implements OnInit {
  private kycService = inject(KycService);
  private cd = inject(ChangeDetectorRef);

  currentView: 'list' | 'details' = 'list';

  // Screen 1: Customer List
  customers: OfficerKycSummary[] = [];
  isLoadingList = false;

  // Screen 2: Customer Details & Documents
  selectedCustomerDocs: OfficerCustomerDocsWithSelection | null = null;
  isLoadingDetails = false;
  selectAll = false;
  isProcessingAction = false;
  actionMessage = '';

  ngOnInit(): void {
    this.fetchCustomerList();
  }

  fetchCustomerList(): void {
    this.isLoadingList = true;
    this.kycService.getOfficerKycList().subscribe({
      next: (data) => {
        this.customers = data || [];
        this.isLoadingList = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load Officer KYC list', err);
        this.isLoadingList = false;
        this.cd.detectChanges();
      }
    });
  }

  viewKyc(customerId: number): void {
    this.currentView = 'details';
    this.isLoadingDetails = true;
    this.selectedCustomerDocs = null;
    this.selectAll = false;
    this.actionMessage = '';

    this.kycService.getOfficerCustomerDocs(customerId).subscribe({
      next: (res) => {
        this.selectedCustomerDocs = {
          ...res,
          documents: (res.documents || []).map(d => ({ ...d, selected: false }))
        };
        this.isLoadingDetails = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load customer documents', err);
        this.isLoadingDetails = false;
        this.cd.detectChanges();
      }
    });
  }

  backToList(): void {
    this.currentView = 'list';
    this.selectedCustomerDocs = null;
    this.actionMessage = '';
    this.fetchCustomerList();
  }

  toggleSelectAll(): void {
    if (!this.selectedCustomerDocs?.documents) return;
    this.selectedCustomerDocs.documents.forEach(doc => {
      doc.selected = this.selectAll;
    });
  }

  onDocSelectChange(): void {
    if (!this.selectedCustomerDocs?.documents) return;
    this.selectAll =
      this.selectedCustomerDocs.documents.length > 0 &&
      this.selectedCustomerDocs.documents.every(d => d.selected);
  }

  getSelectedDocIds(): number[] {
    if (!this.selectedCustomerDocs?.documents) return [];
    return this.selectedCustomerDocs.documents
      .filter(d => d.selected)
      .map(d => d.documentId);
  }

  approveSelected(): void {
    const ids = this.getSelectedDocIds();
    if (ids.length === 0) {
      alert('Please select at least one document to approve.');
      return;
    }

    this.isProcessingAction = true;
    this.actionMessage = '';

    this.kycService.bulkUpdateDocuments({ documentIds: ids, actionType: 'Approve' }).subscribe({
      next: () => {
        this.isProcessingAction = false;
        if (this.selectedCustomerDocs?.documents) {
          this.selectedCustomerDocs.documents
            .filter(d => ids.includes(d.documentId))
            .forEach(d => {
              d.verificationStatus = 'Approved';
              d.selected = false;
            });
        }
        this.selectAll = false;
        this.actionMessage = 'Selected document(s) approved successfully!';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isProcessingAction = false;
        this.actionMessage = 'Error approving selected documents.';
        console.error('Approve error', err);
        this.cd.detectChanges();
      }
    });
  }

  rejectSelected(): void {
    const ids = this.getSelectedDocIds();
    if (ids.length === 0) {
      alert('Please select at least one document to reject.');
      return;
    }

    this.isProcessingAction = true;
    this.actionMessage = '';

    this.kycService.bulkUpdateDocuments({ documentIds: ids, actionType: 'Reject' }).subscribe({
      next: () => {
        this.isProcessingAction = false;
        if (this.selectedCustomerDocs?.documents) {
          this.selectedCustomerDocs.documents
            .filter(d => ids.includes(d.documentId))
            .forEach(d => {
              d.verificationStatus = 'Rejected';
              d.selected = false;
            });
        }
        this.selectAll = false;
        this.actionMessage = 'Selected document(s) rejected.';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isProcessingAction = false;
        this.actionMessage = 'Error rejecting selected documents.';
        console.error('Reject error', err);
        this.cd.detectChanges();
      }
    });
  }

  openPdf(filePath: string): void {
    if (!filePath) {
      alert('Document file path is not available.');
      return;
    }
    const url = this.kycService.getPdfUrl(filePath);
    window.open(url, '_blank');
  }
}

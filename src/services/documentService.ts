import api from './api';
import axios from 'axios';

interface ApproveDocumentRequest {
  documentId: number;
  documentType: string;
  isApproved: boolean;
  amountPaid?: number;
  orderId?: string;
  amount?: number;
  currency?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  items?: string;
  reservationId?: number;
}

interface ApproveDocumentResponse {
  isSuccess: boolean;
  error?: string;
  value?: {
    documentId: number;
    status: string;
  };
}

export const approveDocument = async (
  documentData: ApproveDocumentRequest
): Promise<ApproveDocumentResponse> => {
  try {
    const response = await api.post(
      '/Payments/approve-document', 
      documentData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error approving/rejecting document:', error);
    
    let errorMessage = 'Failed to process document approval/rejection';
    
    if (axios.isAxiosError(error)) {
      
      if (error.response?.data?.message === "Document Not Found") {
        errorMessage = "Document not found. It may have been deleted or already processed.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
    }
    
    return {
      isSuccess: false,
      error: errorMessage
    };
  }
};
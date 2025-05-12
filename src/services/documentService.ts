import api from './api';
import axios from 'axios';

interface ApproveDocumentRequest {
  documentId: number;
  documentType: string;
  isApproved: boolean;
  amountPaid?: number;
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
      'http://localhost:5162/api/Reservation/approve-document', 
      documentData
    );
    return response.data;
  } catch (error) {
    console.error('Error approving/rejecting document:', error);
    
    // Extract the specific error message from the backend response
    let errorMessage = 'Failed to process document approval/rejection';
    
    if (axios.isAxiosError(error)) {
      // Handle Axios error responses
      if (error.response?.data?.message === "Document Not Found") {
        errorMessage = "Document not found. It may have been deleted or already processed.";
      } else if (error.response?.data?.message) {
        // Use any other specific message from the backend
        errorMessage = error.response.data.message;
      }
    }
    
    return {
      isSuccess: false,
      error: errorMessage
    };
  }
};
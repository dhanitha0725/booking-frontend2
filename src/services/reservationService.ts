import api from './api';
import { UserInfo, BookingItemDto } from '../types/reservationData';
import dayjs from 'dayjs';
import axios from 'axios';

export interface CreateReservationPayload {
  facilityId: number;
  startDate: string;
  endDate: string;
  total: number;
  customerType: string;
  paymentMethod: string; 
  items: {
    itemId: number;
    quantity: number;
    type: string;
  }[];
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    organizationName?: string;
  };
}

interface CreateReservationResponse {
  isSuccess: boolean;
  error?: string;
  value: {
    reservationId: number;
  };
}

interface UploadDocumentResponse {
  isSuccess: boolean;
  error?: string;
  value?: {
    documentId: number;
  };
}

 //DocumentType enum matching the backend DocumentType enum
export enum DocumentType {
  ApprovalDocument = "ApprovalDocument",
  BankReceipt = "BankReceipt",
}

/**
 * Creates a new reservation in the system
 * @param payload - The reservation details
 * @returns Promise with the created reservation data
 */
export const createReservation = async (
  payload: CreateReservationPayload
): Promise<CreateReservationResponse> => {
  try {
    // Log the payload to debug
    console.log('Sending reservation payload:', JSON.stringify(payload, null, 2));
    
    // Ensure payload structure matches exactly what the backend expects
    const formattedPayload = {
      facilityId: payload.facilityId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      total: payload.total,
      customerType: payload.customerType,
      paymentMethod: payload.paymentMethod || '',
      items: payload.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        type: item.type
      })),
      userDetails: {
        firstName: payload.userDetails.firstName,
        lastName: payload.userDetails.lastName,
        email: payload.userDetails.email,
        phoneNumber: payload.userDetails.phoneNumber || '',
        organizationName: payload.userDetails.organizationName || ''
      }
    };
    
    const response = await api.post('/Reservation/createReservation', formattedPayload);
    return response.data;
  } catch (error) {
    // Re-throw with more context if needed
    console.error('Error creating reservation:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Uploads a document associated with either a reservation or a payment
 * @param documentData - Document data including file and type
 * @param reservationId - for reservation documents
 * @param paymentId - for bank receipt documents
 * @returns Promise with upload result
 */
export const uploadDocument = async ({
  file,
  documentType,
  reservationId,
  paymentId
}: {
  file: File;
  documentType: DocumentType;
  reservationId?: number;
  paymentId?: string;
}): Promise<UploadDocumentResponse> => {
  try {
    // Validate at least one ID is provided
    if (!reservationId && !paymentId) {
      throw new Error("Either reservationId or paymentId must be provided");
    }
    
    const formData = new FormData();
    
    // Add appropriate ID based on document type
    if (reservationId) {
      formData.append('ReservationId', reservationId.toString());
    }
    
    if (paymentId) {
      formData.append('PaymentId', paymentId);
    }
    
    // Add document info
    formData.append('Document.DocumentType', documentType);
    formData.append('Document.File', file);

    const response = await api.post('/Reservation/uploadDocument', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error uploading ${documentType} document:`, error);
    throw error;
  }
};

/**
 * Helper function to create a reservation and upload associated documents
 * @param facilityId - ID of the facility
 * @param startDate - Start date of reservation
 * @param endDate - End date of reservation
 * @param total - Total price
 * @param customerType - Type of customer (private, public, corporate)
 * @param paymentMethod - Payment method (online, bank, cash)
 * @param items - Selected items for reservation
 * @param userDetails - User's personal details
 * @param approvalDocuments - Documents required for non-private customers
 * @param bankTransferDocuments - Documents for bank transfer payment
 * @returns Reservation ID and success status
 */
export const createReservationWithDocuments = async ({
  facilityId,
  startDate,
  endDate,
  total,
  customerType,
  paymentMethod,
  items,
  userDetails,
  approvalDocuments,
  bankTransferDocuments
}: {
  facilityId: number;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  total: number;
  customerType: string;
  paymentMethod: string;
  items: BookingItemDto[];
  userDetails: UserInfo;
  approvalDocuments?: File[];
  bankTransferDocuments?: File[];
}): Promise<{ reservationId: number; isSuccess: boolean }> => {
  // Prepare reservation payload
  const reservationPayload: CreateReservationPayload = {
    facilityId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    total,
    customerType,
    // Always include payment method (empty string if online)
    paymentMethod: paymentMethod === "online" ? "" : paymentMethod,
    items: items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      type: item.type,
    })),
    userDetails: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber || "",
      organizationName: userDetails.organizationName || "",
    },
  };
  // Create the reservation
  const createRes = await createReservation(reservationPayload);
  
  if (!createRes.isSuccess) {
    throw new Error(createRes.error || "Failed to create reservation");
  }

  const reservationId = createRes.value.reservationId;

  // Upload approval documents for public/corporate customers
  if ((customerType === "public" || customerType === "corporate") && 
      approvalDocuments && approvalDocuments.length > 0) {
    await uploadDocument({
      file: approvalDocuments[0],
      documentType: DocumentType.ApprovalDocument,
      reservationId: reservationId
    });
  }

  // Upload bank transfer receipt if applicable
  if (paymentMethod === "bank" && 
      bankTransferDocuments && bankTransferDocuments.length > 0) {
    await uploadDocument({
      file: bankTransferDocuments[0],
      documentType: DocumentType.BankReceipt,
      reservationId: reservationId
    });
  }

  return { reservationId, isSuccess: true };
};

/**
 * Uploads a payment receipt document
 * @param paymentId - ID of the payment
 * @param file - The receipt file to upload
 * @returns Promise with upload result
 */
export const uploadPaymentReceipt = async (
  paymentId: string,
  file: File
): Promise<UploadDocumentResponse> => {
  return uploadDocument({
    file,
    documentType: DocumentType.BankReceipt,
    paymentId
  });
};

export default {
  createReservation,
  uploadDocument,
  createReservationWithDocuments,
  uploadPaymentReceipt,
  DocumentType
};
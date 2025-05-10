import api from './api';
import { UserInfo, BookingItemDto } from '../types/reservationData';
import dayjs from 'dayjs';

/**
 * Service for handling reservation-related API operations
 */
export interface CreateReservationPayload {
  facilityId: number;
  startDate: string;
  endDate: string;
  total: number;
  customerType: string;
  paymentMethod?: string;
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
    // Add other fields that the API returns
  };
}

interface UploadDocumentResponse {
  isSuccess: boolean;
  error?: string;
  value?: any;
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
    const response = await api.post('/Reservation/createReservation', payload);
    return response.data;
  } catch (error) {
    // Re-throw with more context if needed
    console.error('Error creating reservation:', error);
    throw error;
  }
};

/**
 * Uploads a document associated with a reservation
 * @param reservationId - ID of the reservation
 * @param documentType - Type of document (e.g., "ApprovalDocument", "PaymentReceipt")
 * @param file - The file to upload
 * @returns Promise with upload result
 */
export const uploadDocument = async (
  reservationId: number,
  documentType: string,
  file: File
): Promise<UploadDocumentResponse> => {
  try {
    const formData = new FormData();
    formData.append('ReservationId', reservationId.toString());
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
    // Only include payment method for bank and cash payments
    ...(paymentMethod !== "online" && { paymentMethod }),
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
    await uploadDocument(
      reservationId,
      "ApprovalDocument",
      approvalDocuments[0]
    );
  }

  // Upload bank transfer receipt if applicable
  if (paymentMethod === "bank" && 
      bankTransferDocuments && bankTransferDocuments.length > 0) {
    await uploadDocument(
      reservationId,
      "PaymentReceipt",
      bankTransferDocuments[0]
    );
  }

  return { reservationId, isSuccess: true };
};

export default {
  createReservation,
  uploadDocument,
  createReservationWithDocuments,
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { generateReceiptPDF, ReceiptData } from "../utils/ReceiptGenerator";

// Minimal payment result type (matches PaymentConfirmationPage shape)
interface PaymentResult {
  reservationId: number;
  orderId: string;
  status: "success" | "failed" | "pending" | "cancelled" | string;
  amount: number;
  message?: string;
}

interface Props {
  paymentResult: PaymentResult;
}

/**
 * Button that collects reservation/payment details (from localStorage if available)
 * and triggers receipt PDF generation.
 */
const ReceiptDownloadButton: React.FC<Props> = ({ paymentResult }) => {
  const reservation = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentReservation");
      if (!raw) return null;
      return JSON.parse(raw) as any;
    } catch {
      return null;
    }
  }, []);

  const buildReceiptData = (): ReceiptData => {
    const data: ReceiptData = {
      reservationId: paymentResult.reservationId,
      orderId: paymentResult.orderId,
      amount: paymentResult.amount,
      paymentStatus: paymentResult.status,
      paymentMethod: reservation?.paymentMethod || undefined,
      facilityName:
        reservation?.facilityName || reservation?.facility?.name || undefined,
      customerName: reservation?.customerName || undefined,
      customerEmail: reservation?.customerEmail || undefined,
      items:
        reservation?.selectedItems?.length > 0
          ? reservation.selectedItems
              .map(
                (it: any) => `${it.quantity ?? 1}× ${it.type} (ID:${it.itemId})`
              )
              .join(", ")
          : reservation?.items || undefined,
      startDate: reservation?.startDate
        ? new Date(reservation.startDate).toLocaleString()
        : undefined,
      endDate: reservation?.endDate
        ? new Date(reservation.endDate).toLocaleString()
        : undefined,
    };
    return data;
  };

  const handleDownload = () => {
    const receipt = buildReceiptData();
    const ok = generateReceiptPDF(receipt);
    if (!ok) {
      // fallback: simple alert
      // eslint-disable-next-line no-alert
      alert("Failed to generate receipt PDF. Check console for details.");
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      sx={{ mt: 2 }}
    >
      Download Receipt
    </Button>
  );
};

export default ReceiptDownloadButton;

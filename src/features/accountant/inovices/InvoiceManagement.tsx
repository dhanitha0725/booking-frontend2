import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "../../../services/api";
import axios from "axios";
import InvoiceTable from "./InvoiceTable";
import PDFGenerator from "../../../utils/PDFGenerator";

// Invoice interface to match the API response for table data
interface Invoice {
  invoiceID: number;
  amountPaid: number;
  amountDue: number;
  issuedDate: string;
  reservationID: number;
  paymentID: string;
  paymentMethod: string;
  paymentStatus: string;
}

// Detailed invoice interface to match the API response for the detailed view
interface DetailedInvoice {
  invoiceId: number;
  paymentId: string;
  reservationId: number;
  facilityName: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  reservationStatus: string;
  reservationStartDate: string;
  reservationEndDate: string;
}

const InvoiceManagement: React.FC = () => {
  // Store all invoices data retrieved from the backend
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Notification state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to show snackbar messages
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Fetch invoices from the API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Use the real API endpoint
      const response = await api.get("/Invoice/invoice-table-data");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      showSnackbar("Failed to load invoices", "error");

      // Set empty array instead of mock data
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of invoices
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Extract the actual invoice ID number from our formatted ID (e.g., INV-1-2025 -> 1)
  const extractInvoiceId = (formattedId: number): number => {
    return formattedId;
  };

  // Handle downloading an invoice
  const handleDownloadInvoice = async (invoiceId: number) => {
    setDownloadLoading(true);
    try {
      // Extract the actual invoice ID
      const actualInvoiceId = extractInvoiceId(invoiceId);

      // Find the invoice from the table data (for display formatting purposes only)
      const tableInvoice = invoices.find((inv) => inv.invoiceID === invoiceId);

      if (!tableInvoice) {
        showSnackbar("Invoice not found", "error");
        return;
      }

      // Fetch detailed invoice data from the API
      const response = await api.get<DetailedInvoice>(
        `/Invoice/invoice/${actualInvoiceId}`
      );
      const detailedInvoice = response.data;

      console.log("Detailed invoice data:", detailedInvoice);

      const combinedInvoiceData = {
        invoiceID: tableInvoice.invoiceID,
        amountPaid: detailedInvoice.amountPaid,
        amountDue: detailedInvoice.amountDue,
        issuedDate: detailedInvoice.invoiceDate,
        reservationID: detailedInvoice.reservationId,
        paymentID: detailedInvoice.paymentId,
        paymentMethod: tableInvoice.paymentMethod,
        paymentStatus: tableInvoice.paymentStatus,
        facilityName: detailedInvoice.facilityName,
        customerName: detailedInvoice.customerName,
        customerEmail: detailedInvoice.customerEmail,
        reservationStatus: detailedInvoice.reservationStatus,
        reservationStartDate: detailedInvoice.reservationStartDate,
        reservationEndDate: detailedInvoice.reservationEndDate,
        totalAmount: detailedInvoice.totalAmount,
      };

      // Generate and download the PDF using the combined data
      const success = PDFGenerator.generateInvoicePDF(combinedInvoiceData);

      if (success) {
        showSnackbar("Invoice downloaded successfully", "success");
      } else {
        showSnackbar("Failed to download invoice", "error");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);

      // Show more specific error message if possible
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          showSnackbar("Invoice details not found on the server", "error");
        } else {
          showSnackbar(
            `Error: ${error.response?.data?.message || "Failed to fetch invoice details"}`,
            "error"
          );
        }
      } else {
        showSnackbar(
          "An error occurred while downloading the invoice",
          "error"
        );
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Invoice Management</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Invoice table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : invoices.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No invoices found
          </Typography>
        </Box>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onView={handleDownloadInvoice}
          onDelete={() => {}} // Empty function as we're removing the delete action
          isDownloading={downloadLoading}
        />
      )}

      {/* Notification snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceManagement;

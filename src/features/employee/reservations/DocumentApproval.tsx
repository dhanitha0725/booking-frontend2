import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { approveDocument } from "../../../services/documentService";

// Define the props for the DocumentApproval component
interface DocumentApprovalProps {
  documentId: number;
  documentType: string;
  reservationId?: number;
  total?: number;
  userDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  items?: Array<{
    itemId: number;
    quantity: number;
    type: string;
  }>;
  onApproved?: () => void;
  onError?: (errorMessage: string) => void;
  onSuccess?: (successMessage: string) => void;
  disabled?: boolean;
  paymentStatus?: string;
  reservationStatus?: string;
}

// Define the payload structure for document approval
interface ApprovalPayload {
  documentId: number;
  documentType: string;
  isApproved: boolean;
  amountPaid?: number;
  // Payment details fields for ApprovalDocument
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

const DocumentApproval: React.FC<DocumentApprovalProps> = ({
  documentId,
  documentType,
  reservationId = 0,
  total = 0,
  userDetails = { firstName: "", lastName: "", email: "" },
  items = [],
  onApproved,
  onError,
  onSuccess,
  disabled = false,
  paymentStatus = "",
  reservationStatus = "",
}) => {
  // State variables for managing approval process
  const [loading, setLoading] = useState(false);
  const [openAmountDialog, setOpenAmountDialog] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number | string>("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  // Check if approval buttons should be hidden based on payment and reservation status
  const shouldHideButtons = () => {
    // Hide if payment is completed
    if (paymentStatus.toLowerCase() === "completed") {
      return true;
    }

    // Hide for specific reservation statuses
    if (
      ["confirmed", "completed", "cancelled"].includes(
        reservationStatus.toLowerCase()
      )
    ) {
      return true;
    }

    return false;
  };

  // Handle document approval/rejection
  const handleApproval = async (isApproved: boolean) => {
    // For bank receipts that are being approved, collect the amount
    if (documentType === "BankReceipt" && isApproved) {
      setOpenAmountDialog(true);
      return;
    }

    await processApproval(isApproved);
  };

  // Process the document approval or rejection
  const processApproval = async (isApproved: boolean, amount?: number) => {
    setLoading(true);

    try {
      // Create the base payload
      const payload: ApprovalPayload = {
        documentId,
        documentType,
        isApproved,
      };

      // Add amount for bank receipts
      if (
        documentType === "BankReceipt" &&
        isApproved &&
        amount !== undefined
      ) {
        // For bank receipts, only include documentId, documentType, isApproved, and amountPaid
        payload.amountPaid = amount;

        // Additional debugging
        console.log(
          "Bank receipt approval payload:",
          JSON.stringify(payload, null, 2)
        );
      }
      // Add payment details for ApprovalDocument approvals
      else if (documentType === "ApprovalDocument" && isApproved) {
        const orderId = `RES-${reservationId}-${Date.now()}`;

        payload.orderId = orderId;
        payload.amount = total;
        payload.currency = "Rs.";
        payload.firstName = userDetails.firstName || "N/A";
        payload.lastName = userDetails.lastName || "N/A";
        payload.email = userDetails.email;
        payload.phone = userDetails.phoneNumber || "0000000000";
        payload.address = "National Institute of Co-Operative Development";
        payload.city = "Colombo";
        payload.country = "Sri Lanka";

        // Format items
        const formattedItems = items
          .map((item) => {
            const id = item.itemId > 0 ? item.itemId : 1;
            return `${item.quantity} × ${item.type} (ID: ${id})`;
          })
          .join(", ");

        payload.items = formattedItems || "No items specified";
        payload.reservationId = reservationId;
      }


      const response = await approveDocument(payload);

      // check if the response is successful
      if (response.isSuccess) {
        setIsProcessed(true);
        if (onSuccess) {
          onSuccess(
            isApproved
              ? "Document approved successfully"
              : "Document rejected successfully"
          );
        }
        if (onApproved) {
          onApproved();
        }
      } else {
        console.error("Document approval failed response:", response);
        if (onError) {
          onError(response.error || "Failed to process document");
        }
      }
    } catch (err) {
      console.error("Error processing document:", err);
      if (onError) {
        onError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle amount confirmation for bank receipts
  const handleAmountConfirm = () => {
    const amount =
      typeof amountPaid === "string" ? parseFloat(amountPaid) : amountPaid;
    if (isNaN(amount) || amount <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    setAmountError(null);
    setOpenAmountDialog(false);
    processApproval(true, amount);
  };

  // don't render any buttons if they should be hidden
  if (shouldHideButtons()) {
    return null;
  }

  return (
    <>
      <Stack direction="row" spacing={1} mt={1}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={() => handleApproval(true)}
          disabled={disabled || loading || isProcessed}
          size="small"
        >
          {loading ? <CircularProgress size={20} /> : "Approve"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelOutlinedIcon />}
          onClick={() => handleApproval(false)}
          disabled={disabled || loading || isProcessed}
          size="small"
        >
          {loading ? <CircularProgress size={20} /> : "Reject"}
        </Button>
      </Stack>

      {/* Amount Dialog for Bank Receipts */}
      <Dialog
        open={openAmountDialog}
        onClose={() => setOpenAmountDialog(false)}
      >
        <DialogTitle>Enter Payment Amount</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the amount paid for this bank receipt:
          </Typography>
          <TextField
            label="Amount Paid"
            type="number"
            fullWidth
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            InputProps={{
              startAdornment: <Typography variant="body1">Rs. </Typography>,
            }}
            inputProps={{
              step: "0.01",
              min: "0",
            }}
            error={!!amountError}
            helperText={amountError || ""}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAmountDialog(false)}>Cancel</Button>
          <Button onClick={handleAmountConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentApproval;

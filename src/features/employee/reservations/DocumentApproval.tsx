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

interface DocumentApprovalProps {
  documentId: number;
  documentType: string;
  onApproved?: () => void;
  onError?: (errorMessage: string) => void;
  onSuccess?: (successMessage: string) => void;
  disabled?: boolean;
}

interface ApprovalPayload {
  documentId: number;
  documentType: string;
  isApproved: boolean;
  amountPaid?: number;
}

const DocumentApproval: React.FC<DocumentApprovalProps> = ({
  documentId,
  documentType,
  onApproved,
  onError,
  onSuccess,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [openAmountDialog, setOpenAmountDialog] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number | string>("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  // Handle document approval/rejection
  const handleApproval = async (isApproved: boolean) => {
    // For bank receipts that are being approved, we need to collect the amount
    if (documentType === "BankReceipt" && isApproved) {
      setOpenAmountDialog(true);
      return;
    }

    await processApproval(isApproved);
  };

  const processApproval = async (isApproved: boolean, amount?: number) => {
    setLoading(true);

    try {
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
        payload.amountPaid = amount;
      }

      const response = await approveDocument(payload);

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
              startAdornment: <Typography variant="body1">LKR </Typography>,
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

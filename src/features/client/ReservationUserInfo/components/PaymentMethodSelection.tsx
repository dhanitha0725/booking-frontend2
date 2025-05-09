import { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper,
  Alert,
  TextField,
  Divider
} from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DocumentUpload from "./DocumentUpload";

export type PaymentMethod = "online" | "bank" | "cash";

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  bankTransferDocuments: File[];
  onBankTransferDocumentsChange: (files: File[]) => void;
}

const PaymentMethodSelection = ({
  selectedMethod,
  onMethodChange,
  bankTransferDocuments,
  onBankTransferDocumentsChange
}: PaymentMethodSelectionProps) => {
  const [note, setNote] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onMethodChange(event.target.value as PaymentMethod);
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          name="payment-method"
          value={selectedMethod}
          onChange={handleChange}
        >
          <Paper 
            elevation={selectedMethod === "online" ? 3 : 1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              border: selectedMethod === "online" ? `2px solid ${(theme) => theme.palette.primary.main}` : "none",
              transition: "all 0.2s"
            }}
          >
            <FormControlLabel
              value="online"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  <Typography>Online Payment (Credit Card/Debit Card)</Typography>
                </Box>
              }
            />
            {selectedMethod === "online" && (
              <Typography variant="body2" sx={{ mt: 1, ml: 4, color: "text.secondary" }}>
                Secure payment through our payment gateway. You'll be redirected to complete your payment.
              </Typography>
            )}
          </Paper>

          <Paper 
            elevation={selectedMethod === "bank" ? 3 : 1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              border: selectedMethod === "bank" ? `2px solid ${(theme) => theme.palette.primary.main}` : "none",
              transition: "all 0.2s"
            }}
          >
            <FormControlLabel
              value="bank"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  <Typography>Bank Transfer</Typography>
                </Box>
              }
            />
            {selectedMethod === "bank" && (
              <Box sx={{ ml: 4, mt: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                  Please transfer the amount to the following bank account and upload the receipt:
                </Typography>
                <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2">Bank: National Bank of Sri Lanka</Typography>
                  <Typography variant="body2">Account Name: Facility Booking System</Typography>
                  <Typography variant="body2">Account Number: 1234-5678-9012-3456</Typography>
                  <Typography variant="body2">Branch: Main Branch, Colombo</Typography>
                  <Typography variant="body2">Reference: Please include your name and email</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Upload Bank Transfer Receipt</Typography>
                <DocumentUpload 
                  documents={bankTransferDocuments}
                  onDocumentsChange={onBankTransferDocumentsChange}
                  title="Bank Transfer Receipt"
                  helperText="Please upload a screenshot or photo of your bank transfer receipt"
                />
              </Box>
            )}
          </Paper>

          <Paper 
            elevation={selectedMethod === "cash" ? 3 : 1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              border: selectedMethod === "cash" ? `2px solid ${(theme) => theme.palette.primary.main}` : "none",
              transition: "all 0.2s"
            }}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  <Typography>Cash Payment</Typography>
                </Box>
              }
            />
            {selectedMethod === "cash" && (
              <Box sx={{ ml: 4, mt: 1 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  If payment is not confirmed within two days, your reservation will be automatically cancelled.
                </Alert>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Please visit our office to complete your payment. Your reservation will be temporarily held until payment is received.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  margin="normal"
                  label="Additional Notes (Optional)"
                  placeholder="Any specific instructions regarding your cash payment"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Box>
            )}
          </Paper>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentMethodSelection;
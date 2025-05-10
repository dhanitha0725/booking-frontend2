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
  Divider,
  Theme,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DocumentUpload from "./DocumentUpload";

export type PaymentMethod = "Online" | "Bank" | "Cash";

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  bankTransferDocuments: File[];
  onBankTransferDocumentsChange: (files: File[]) => void;
  customerType: "corporate" | "public" | "private";
}

const StyledPaper = ({
  selected,
  children,
}: {
  selected: boolean;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={selected ? 3 : 1}
    sx={{
      p: 2,
      mb: 2,
      border: selected
        ? (theme: Theme) => `2px solid ${theme.palette.primary.main}`
        : "none",
      transition: "all 0.2s",
    }}
  >
    {children}
  </Paper>
);

const PaymentMethodSelection = ({
  selectedMethod,
  onMethodChange,
  bankTransferDocuments,
  onBankTransferDocumentsChange,
  customerType,
}: PaymentMethodSelectionProps) => {
  const [note, setNote] = useState("");
  const showBankTransfer = customerType === "private";

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          name="payment-method"
          value={selectedMethod}
          onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
        >
          <StyledPaper selected={selectedMethod === "Online"}>
            <FormControlLabel
              value="Online"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  <Typography>
                    Online Payment (Credit Card/Debit Card)
                  </Typography>
                </Box>
              }
            />
            {selectedMethod === "Online" && (
              <Typography
                variant="body2"
                sx={{ mt: 1, ml: 4, color: "text.secondary" }}
              >
                Secure payment through our payment gateway. You'll be redirected
                to complete your payment.
              </Typography>
            )}
          </StyledPaper>

          {showBankTransfer && (
            <StyledPaper selected={selectedMethod === "Bank"}>
              <FormControlLabel
                value="Bank"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccountBalanceIcon sx={{ mr: 1 }} />
                    <Typography>Bank Transfer</Typography>
                  </Box>
                }
              />
              {selectedMethod === "Bank" && (
                <Box sx={{ ml: 4, mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    Please transfer the amount to the following bank account and
                    upload the receipt:
                  </Typography>
                  <Box
                    sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}
                  >
                    <Typography variant="body2">
                      Bank: Hatton National Bank
                    </Typography>
                    <Typography variant="body2">
                      Account Name: National Institute of Co-Operative
                      Development
                    </Typography>
                    <Typography variant="body2">
                      Account Number: 1234-5678-9012-3456
                    </Typography>
                    <Typography variant="body2">
                      Branch: Main Branch, Colombo
                    </Typography>
                    <Typography variant="body2">
                      Reference: Please include your name or email
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Upload Bank Transfer Receipt
                  </Typography>
                  <DocumentUpload
                    documents={bankTransferDocuments}
                    onDocumentsChange={onBankTransferDocumentsChange}
                  />
                </Box>
              )}
            </StyledPaper>
          )}

          <StyledPaper selected={selectedMethod === "Cash"}>
            <FormControlLabel
              value="Cash"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  <Typography>Cash Payment</Typography>
                </Box>
              }
            />
            {selectedMethod === "Cash" && (
              <Box sx={{ ml: 4, mt: 1 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  If payment is not confirmed within two days, your reservation
                  will be automatically cancelled.
                </Alert>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Please visit our office to complete your payment. Your
                  reservation will be temporarily held until payment is
                  received.
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
          </StyledPaper>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentMethodSelection;

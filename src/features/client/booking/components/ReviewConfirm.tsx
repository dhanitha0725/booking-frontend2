import { Paper, Typography, Alert, Box } from "@mui/material";
import BookingSummary from "./BookingSummary";

interface ReviewConfirmProps {
  bookingData: Record<string, any>;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const ReviewConfirm = ({ bookingData, contactInfo }: ReviewConfirmProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Review and Confirm
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Name:</strong> {contactInfo.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {contactInfo.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Phone:</strong> {contactInfo.phone}
        </Typography>
      </Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please review the information above before confirming your booking.
      </Alert>
      {/* booking summary */}
      <BookingSummary bookingData={bookingData} />
    </Paper>
  );
};

export default ReviewConfirm;

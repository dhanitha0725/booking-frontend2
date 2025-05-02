import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Person,
  CalendarMonth,
  AttachMoney,
  Phone,
  Email,
  Receipt,
  EventAvailable,
  Update,
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../../../../services/api";
import { AxiosError } from "axios";
import {
  FullReservationDetails,
  FullReservationInfoProps,
  ReservationStatus,
  UserType,
  BookedItem,
  ReservationUser,
  PaymentDetails,
} from "../../../../types/ReservationDetails";

// Utility component for displaying fields
const DetailField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
}> = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    {icon}
    <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

// Reservation Details Section
const ReservationDetailsSection: React.FC<{
  reservation: FullReservationDetails;
}> = ({ reservation }) => {
  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy HH:mm") : "N/A";
  const statusColors: Record<
    ReservationStatus,
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
  > = {
    PendingApproval: "warning",
    PendingPayment: "info",
    Approved: "success",
    Completed: "primary",
    Cancelled: "error",
    Confirmed: "success",
    Expired: "error",
  };
  const renderStatusChip = (status: ReservationStatus | undefined | null) =>
    status ? (
      <Chip
        label={status}
        color={statusColors[status] || "default"}
        size="small"
      />
    ) : (
      <Chip label="Unknown" color="default" size="small" />
    );

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
        Reservation Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DetailField
            icon={<CalendarMonth sx={{ mr: 1, color: "text.secondary" }} />}
            label="Start Date"
            value={formatDate(reservation.startDate)}
          />
          <DetailField
            icon={<CalendarMonth sx={{ mr: 1, color: "text.secondary" }} />}
            label="End Date"
            value={formatDate(reservation.endDate)}
          />
          <DetailField
            icon={<AttachMoney sx={{ mr: 1, color: "text.secondary" }} />}
            label="Total Amount"
            value={`LKR ${reservation.total.toFixed(2)}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailField
            icon={<EventAvailable sx={{ mr: 1, color: "text.secondary" }} />}
            label="Created On"
            value={formatDate(reservation.createdDate)}
          />
          {reservation.updatedDate && (
            <DetailField
              icon={<Update sx={{ mr: 1, color: "text.secondary" }} />}
              label="Last Updated"
              value={formatDate(reservation.updatedDate)}
            />
          )}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
              Status:
            </Typography>
            {renderStatusChip(reservation.status as ReservationStatus)}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Booked Items Section
const BookedItemsSection: React.FC<{
  bookedItems: BookedItem[];
  total: number;
}> = ({ bookedItems, total }) => {
  const formatCurrency = (amount: number) => `LKR ${amount.toFixed(2)}`;
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell align="right">{formatCurrency(item.price)}</TableCell>
              <TableCell align="right">{item.quantity || 1}</TableCell>
              <TableCell align="right">
                {formatCurrency(item.price * (item.quantity || 1))}
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell colSpan={4} align="right" sx={{ fontWeight: "bold" }}>
              Total:
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// User Details Section
const UserDetailsSection: React.FC<{ user: ReservationUser }> = ({ user }) => {
  const userTypeColors: Record<
    UserType,
    "default" | "primary" | "secondary" | "warning"
  > = {
    public: "primary",
    private: "secondary",
    corporate: "warning",
  };
  const renderUserTypeChip = (userType: UserType | undefined | null) =>
    userType ? (
      <Chip
        label={userType.charAt(0).toUpperCase() + userType.slice(1)}
        color={userTypeColors[userType] || "default"}
        size="small"
      />
    ) : (
      <Chip label="Unknown" color="default" size="small" />
    );

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h6" gutterBottom>
        User Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DetailField
            icon={<Person sx={{ mr: 1, color: "text.secondary" }} />}
            label="Name"
            value={`${user.firstName} ${user.lastName}`}
          />
          <DetailField
            icon={<Email sx={{ mr: 1, color: "text.secondary" }} />}
            label="Email"
            value={user.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailField
            icon={<Phone sx={{ mr: 1, color: "text.secondary" }} />}
            label="Phone"
            value={user.phoneNumber}
          />
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
              User Type:
            </Typography>
            {renderUserTypeChip(user.userType as UserType)}
          </Box>
          {user.organizationName && (
            <DetailField
              icon={<Person sx={{ mr: 1, color: "text.secondary" }} />}
              label="Organization"
              value={user.organizationName}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

// Payment Details Section
const PaymentDetailsSection: React.FC<{ payment: PaymentDetails }> = ({
  payment,
}) => {
  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy HH:mm") : "N/A";
  const formatCurrency = (amount: number) => `LKR ${amount.toFixed(2)}`;
  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DetailField
            icon={<Receipt sx={{ mr: 1, color: "text.secondary" }} />}
            label="Order ID"
            value={payment.orderId}
          />
          <DetailField
            icon={<AttachMoney sx={{ mr: 1, color: "text.secondary" }} />}
            label="Amount Paid"
            value={formatCurrency(payment.amountPaid)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailField
            icon={<CalendarMonth sx={{ mr: 1, color: "text.secondary" }} />}
            label="Payment Date"
            value={formatDate(payment.paidDate)}
          />
          <DetailField
            icon={<AttachMoney sx={{ mr: 1, color: "text.secondary" }} />}
            label="Payment Method"
            value={payment.paymentMethod}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
              Payment Status:
            </Typography>
            <Chip
              label={payment.status}
              size="small"
              color={
                payment.status.toLowerCase() === "paid" ? "success" : "warning"
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Main Component
const FullReservationInfo: React.FC<FullReservationInfoProps> = ({
  open,
  onClose,
  reservationId,
}) => {
  const [reservation, setReservation] = useState<FullReservationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !reservationId) {
      setReservation(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchReservationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token not found");
        const response = await api.get(
          `http://localhost:5162/api/Reservation/${reservationId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReservation(response.data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message ||
            "Failed to fetch reservation details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [open, reservationId]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Reservation #{reservation?.reservationId || reservationId}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reservation ? (
          <>
            <ReservationDetailsSection reservation={reservation} />
            <BookedItemsSection
              bookedItems={reservation.bookedItems}
              total={reservation.total}
            />
            <UserDetailsSection user={reservation.user} />
            <PaymentDetailsSection payment={reservation.payment} />
          </>
        ) : (
          <Typography>No reservation details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FullReservationInfo;

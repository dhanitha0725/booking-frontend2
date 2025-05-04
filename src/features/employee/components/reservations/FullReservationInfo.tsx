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
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
  Business,
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../../../../services/api";
import { AxiosError } from "axios";
import {
  FullReservationDetails,
  FullReservationInfoProps,
  ReservationStatus,
  UserType,
  ReservationUser,
  PaymentDetails,
  BookedItem,
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
  const formatDate = (dateString: string | null) =>
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
  const renderStatusChip = (status: string) =>
    status ? (
      <Chip
        label={status}
        color={statusColors[status as ReservationStatus] || "default"}
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
            {renderStatusChip(reservation.status)}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Booked Items Section
const BookedItemsSection: React.FC<{
  reservedPackages: FullReservationDetails["reservedPackages"];
  reservedRooms: FullReservationDetails["reservedRooms"];
  total: number;
}> = ({ reservedPackages, reservedRooms, total }) => {
  const formatCurrency = (amount: number) => `LKR ${amount.toFixed(2)}`;

  // Transform packages and rooms into bookedItems
  const bookedItems: BookedItem[] = [
    ...reservedPackages.map((pkg, index) => ({
      id: index + 1,
      name: pkg.packageName,
      type: "Package" as const,
      price: total / (reservedPackages.length + reservedRooms.length || 1),
      quantity: 1,
      facilityName: pkg.facilityName,
    })),
    ...reservedRooms.map((room, index) => ({
      id: index + 1 + reservedPackages.length,
      name: room.roomType,
      type: "Room" as const,
      price: total / (reservedPackages.length + reservedRooms.length || 1),
      quantity: 1,
      facilityName: room.facilityName,
    })),
  ];

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Facility</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookedItems.length > 0 ? (
            bookedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.facilityName}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.price)}
                </TableCell>
                <TableCell align="right">{item.quantity || 1}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.price * (item.quantity || 1))}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No booked items available
              </TableCell>
            </TableRow>
          )}
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
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
const UserDetailsSection: React.FC<{
  user: ReservationUser;
  userType: UserType;
}> = ({ user, userType }) => {
  const userTypeColors: Record<
    UserType,
    "default" | "primary" | "secondary" | "warning"
  > = {
    public: "primary",
    private: "secondary",
    corporate: "warning",
  };
  const renderUserTypeChip = (userType: string) =>
    userType ? (
      <Chip
        label={userType.charAt(0).toUpperCase() + userType.slice(1)}
        color={userTypeColors[userType as UserType] || "default"}
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
          {user.phoneNumber && (
            <DetailField
              icon={<Phone sx={{ mr: 1, color: "text.secondary" }} />}
              label="Phone"
              value={user.phoneNumber}
            />
          )}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
              User Type:
            </Typography>
            {renderUserTypeChip(userType)}
          </Box>
          {user.organizationName && user.organizationName.trim() !== "" && (
            <DetailField
              icon={<Business sx={{ mr: 1, color: "text.secondary" }} />}
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
const PaymentDetailsSection: React.FC<{
  payments: PaymentDetails[];
}> = ({ payments }) => {
  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy HH:mm") : "N/A";
  const formatCurrency = (amount: number) => `LKR ${amount.toFixed(2)}`;

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <Box
            key={payment.orderID}
            sx={{
              mb: 2,
              pb: 2,
              borderBottom:
                index < payments.length - 1 ? "1px solid #e0e0e0" : "none",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DetailField
                  icon={<Receipt sx={{ mr: 1, color: "text.secondary" }} />}
                  label="Order ID"
                  value={payment.orderID}
                />
                <DetailField
                  icon={<AttachMoney sx={{ mr: 1, color: "text.secondary" }} />}
                  label="Amount Paid"
                  value={formatCurrency(payment.amountPaid)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailField
                  icon={
                    <CalendarMonth sx={{ mr: 1, color: "text.secondary" }} />
                  }
                  label="Payment Date"
                  value={formatDate(payment.createdDate)}
                />
                <DetailField
                  icon={<AttachMoney sx={{ mr: 1, color: "text.secondary" }} />}
                  label="Payment Method"
                  value={payment.method}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mr: 1 }}
                  >
                    Payment Status:
                  </Typography>
                  <Chip
                    label={payment.status}
                    size="small"
                    color={
                      payment.status.toLowerCase() === "completed"
                        ? "success"
                        : "warning"
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <Typography>No payment details available</Typography>
      )}
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
          `http://localhost:5162/api/Reservation/reservation-details/${reservationId}`,
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
        console.error("Error fetching reservation details:", err);
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
              reservedPackages={reservation.reservedPackages}
              reservedRooms={reservation.reservedRooms}
              total={reservation.total}
            />
            <UserDetailsSection
              user={reservation.user}
              userType={reservation.userType}
            />
            <PaymentDetailsSection payments={reservation.payments} />
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

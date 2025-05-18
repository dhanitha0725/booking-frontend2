import React, { useState } from "react";
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
  Snackbar, // Add Snackbar import
} from "@mui/material";
import { format } from "date-fns";
import {
  FullReservationDetails,
  FullReservationInfoProps,
  ReservationStatus,
  UserType,
  ReservationUser,
  PaymentDetails,
  BookedItem,
} from "../../../types/ReservationDetails";
import useReservationDetails from "../../../hooks/useReservationDetails";
import DocumentViewer from "./DocumentViewer";
import ConfirmCashPayment from "../payments/ConfirmCashPayment";

const DetailField: React.FC<{
  label: string;
  value: string | number | React.ReactNode;
}> = ({ label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

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
    PendingPaymentVerification: "warning",
    Approved: "success",
    Completed: "success",
    Cancelled: "error",
    Confirmed: "success",
    Expired: "error",
    PendingCashPayment: "secondary",
  };

  // Rest of the component remains unchanged
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
            label="Start Date"
            value={formatDate(reservation.startDate)}
          />
          <DetailField
            label="End Date"
            value={formatDate(reservation.endDate)}
          />
          <DetailField
            label="Total Amount"
            value={`LKR ${reservation.total.toFixed(2)}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailField
            label="Created On"
            value={formatDate(reservation.createdDate)}
          />
          {reservation.updatedDate && (
            <DetailField
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

const BookedItemsSection: React.FC<{
  reservedPackages: FullReservationDetails["reservedPackages"];
  reservedRooms: FullReservationDetails["reservedRooms"];
  total: number;
}> = ({ reservedPackages, reservedRooms, total }) => {
  const formatCurrency = (amount: number) => `LKR ${amount.toFixed(2)}`;
  const bookedItems: BookedItem[] = [
    ...(reservedPackages || []).map((pkg, index) => ({
      id: index + 1,
      name: pkg.packageName,
      type: "Package" as const,
      price:
        total /
        ((reservedPackages?.length || 0) + (reservedRooms?.length || 0) || 1),
      quantity: 1,
      facilityName: pkg.facilityName,
    })),
    ...(reservedRooms || []).map((room, index) => ({
      id: index + 1 + (reservedPackages?.length || 0),
      name: room.roomType,
      type: "Room" as const,
      price:
        total /
        ((reservedPackages?.length || 0) + (reservedRooms?.length || 0) || 1),
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

const UserDetailsSection: React.FC<{
  user?: ReservationUser;
  userType: UserType;
}> = ({ user, userType }) => {
  if (!user) {
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          User Details
        </Typography>
        <Typography>User information is not available</Typography>
      </Paper>
    );
  }

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
            label="Name"
            value={`${user.firstName || ""} ${user.lastName || ""}`}
          />
          <DetailField label="Email" value={user.email || "N/A"} />
        </Grid>
        <Grid item xs={12} md={6}>
          {user.phoneNumber && (
            <DetailField label="Phone" value={user.phoneNumber} />
          )}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mr: 1 }}>
              User Type:
            </Typography>
            {renderUserTypeChip(userType)}
          </Box>
          {user.organizationName && user.organizationName.trim() !== "" && (
            <DetailField label="Organization" value={user.organizationName} />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

const PaymentDetailsSection: React.FC<{ payments?: PaymentDetails[] }> = ({
  payments = [],
}) => {
  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy HH:mm") : "N/A";

  // Updated to handle null values
  const formatCurrency = (amount: number | null) =>
    amount !== null ? `LKR ${amount.toFixed(2)}` : "Not Paid";

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              pb: 2,
              borderBottom:
                index < payments.length - 1 ? "1px solid #e0e0e0" : "none",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {payment.paymentId ? (
                  <DetailField label="Payment ID" value={payment.paymentId} />
                ) : (
                  <DetailField label="Payment ID" value="Not Available" />
                )}
                {payment.orderID ? (
                  <DetailField label="Order ID" value={payment.orderID} />
                ) : (
                  <DetailField label="Order ID" value="Not Available" />
                )}
                <DetailField
                  label="Amount Paid"
                  value={formatCurrency(payment.amountPaid)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailField
                  label="Payment Date"
                  value={formatDate(payment.createdDate)}
                />
                <DetailField label="Payment Method" value={payment.method} />
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
                        : payment.status.toLowerCase() === "pending"
                          ? "warning"
                          : "default"
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

// Add a new component to handle the cash payment confirmation section
const CashPaymentSection: React.FC<{
  reservation: FullReservationDetails;
  onPaymentConfirmed: () => void;
  onError: (message: string) => void;
}> = ({ reservation, onPaymentConfirmed, onError }) => {
  // Only show for reservations with PendingCashPayment status
  if (reservation.status !== "PendingCashPayment") {
    return null;
  }

  // Find payment ID from the payments array
  const pendingPayment = reservation.payments?.find(
    (p) =>
      p.method?.toLowerCase() === "cash" &&
      p.status?.toLowerCase() !== "completed"
  );

  if (!pendingPayment || !pendingPayment.paymentId) {
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
        <Alert severity="warning">
          This reservation requires cash payment, but payment information is
          missing.
        </Alert>
      </Paper>
    );
  }

  return (
    <ConfirmCashPayment
      paymentId={pendingPayment.paymentId}
      reservationId={reservation.reservationId}
      expectedAmount={reservation.total}
      onSuccess={onPaymentConfirmed}
      onError={onError}
    />
  );
};

// Update the DocumentsSection component to pass reservation details
const DocumentsSection: React.FC<{
  documents: FullReservationDetails["documents"];
  payments?: PaymentDetails[];
  reservationStatus: string;
  reservation: FullReservationDetails; // Add full reservation to access details
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}> = ({
  documents = [],
  payments = [],
  reservationStatus = "",
  reservation, // Get the full reservation
  onError,
  onSuccess,
}) => {
  if (!documents?.length) {
    return null;
  }

  // Get payment status if available
  const paymentStatus =
    payments && payments.length > 0 ? payments[0].status : "";

  // Extract the necessary details from reservation
  const reservationDetails = {
    total: reservation.total,
    userDetails: reservation.user,
    items:
      reservation.reservedPackages && reservation.reservedRooms
        ? [
            ...reservation.reservedPackages.map((pkg) => ({
              itemId: 0, // This might need adjustment based on your data structure
              quantity: 1,
              type: "package",
              name: pkg.packageName,
            })),
            ...reservation.reservedRooms.map((room) => ({
              itemId: 0, // This might need adjustment based on your data structure
              quantity: 1,
              type: "room",
              name: room.roomType,
            })),
          ]
        : [],
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
      <DocumentViewer
        documents={documents}
        groupByType={true}
        title="Documents"
        allowApproval={true}
        paymentStatus={paymentStatus}
        reservationStatus={reservationStatus}
        reservationId={reservation.reservationId}
        reservationDetails={reservationDetails} // Pass the extracted details
        onError={onError}
        onSuccess={onSuccess}
        onDocumentStatusChanged={() => {}}
      />
    </Paper>
  );
};

const FullReservationInfo: React.FC<FullReservationInfoProps> = ({
  open,
  onClose,
  reservationId,
}) => {
  // Use the custom hook without refresh feature
  const { reservation, loading, error } = useReservationDetails(
    reservationId,
    open
  );

  // Add state for centralized notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Handle document approval/rejection notifications
  const handleDocumentNotification = (
    message: string,
    severity: "success" | "error"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Handle closing the notification
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Add a handler for payment confirmation
  const handlePaymentConfirmed = () => {
    // Show success notification
    handleDocumentNotification(
      "Cash payment confirmed successfully",
      "success"
    );
  };

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
              reservedPackages={reservation.reservedPackages || []}
              reservedRooms={reservation.reservedRooms || []}
              total={reservation.total}
            />
            <UserDetailsSection
              user={reservation.user}
              userType={reservation.userType}
            />
            <PaymentDetailsSection payments={reservation.payments} />

            {/* Add the Cash Payment confirmation component here */}
            {reservation.status === "PendingCashPayment" && (
              <CashPaymentSection
                reservation={reservation}
                onPaymentConfirmed={handlePaymentConfirmed}
                onError={(message) =>
                  handleDocumentNotification(message, "error")
                }
              />
            )}

            {reservation.documents && reservation.documents.length > 0 && (
              <DocumentsSection
                documents={reservation.documents}
                payments={reservation.payments}
                reservationStatus={reservation.status}
                reservation={reservation}
                onError={(message) =>
                  handleDocumentNotification(message, "error")
                }
                onSuccess={(message) =>
                  handleDocumentNotification(message, "success")
                }
              />
            )}
          </>
        ) : (
          <Typography>No reservation details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      {/* Centralized notification system */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default FullReservationInfo;

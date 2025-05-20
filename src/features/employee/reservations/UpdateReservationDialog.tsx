import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import BookingDateTimePicker, {
  AvailabilityResponseDto,
  CustomerType,
} from "../../client/booking/components/BookingDateTimePicker";
import SelectionTable from "../../client/booking/components/SelectionTable";
import TotalSummary from "../../client/booking/components/TotalSummary";
import {
  BookingItemDto,
  PackagesDto,
  RoomDto,
} from "../../../types/selectedFacility";
import { Reservation, Package, Room } from "../../../types/updateReservation";
import api from "../../../services/api";
import axios from "axios";
import {
  validateUpdateReservationPayload,
  validateReservationForm,
  areBookingItemsEqual,
} from "../../../validations/updateReservationValidation";
import ReservationSummary from "./ReservationSummary";

// Define price interface to avoid using any
interface PriceMapping {
  sector: string;
  price: number;
}

interface UpdateReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservation: Reservation | null;
}

const UpdateReservationDialog: React.FC<UpdateReservationDialogProps> = ({
  open,
  onClose,
  onSuccess,
  reservation,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  // State for form inputs
  const [dateRange, setDateRange] = useState<{
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }>({ startDate: null, endDate: null });
  const [customerType, setCustomerType] = useState<CustomerType>("private");
  const [selectedItems, setSelectedItems] = useState<BookingItemDto[]>([]);
  const [total, setTotal] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityResponseDto>({
    isAvailable: false,
    message: "",
  });

  // State for facility data
  const [packages, setPackages] = useState<PackagesDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [facilityId, setFacilityId] = useState<number | undefined>(undefined);

  // Check reservation status
  const isEditable =
    reservation &&
    !["Cancelled", "Completed", "Expired", "Confirmed"].includes(
      reservation.status
    );

  // Fetch facility data (packages and rooms)
  const fetchFacilityData = useCallback(async () => {
    if (!reservation?.facilityId) return;
    setLoading(true);
    console.log("Fetching facility data for ID:", reservation.facilityId);

    try {
      const response = await api.get(`/Reservation/${reservation.facilityId}`);
      console.log("API response:", response.data);

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.error || "Failed to fetch facility details"
        );
      }

      const data = response.data.value;

      if (!data) {
        throw new Error("Invalid facility data");
      }

      // Handle empty packages array safely
      const mappedPackages = Array.isArray(data.packages)
        ? data.packages.map((pkg: Package) => ({
            packageId: pkg.packageId,
            packageName: pkg.packageName,
            duration: pkg.duration || 0,
            requiresDates:
              typeof pkg.duration === "number" ? pkg.duration >= 24 : false,
            pricing: pkg.pricing,
          }))
        : [];

      const mappedRooms = Array.isArray(data.rooms)
        ? data.rooms.map((room: Room) => ({
            roomTypeId: room.roomTypeId,
            roomType: room.roomType,
            roomPricing: room.roomPricing.map((price: PriceMapping) => ({
              sector: price.sector,
              price: price.price,
            })),
          }))
        : [];

      console.log("Mapped packages:", mappedPackages);
      console.log("Mapped rooms:", mappedRooms);

      setPackages(mappedPackages);
      setRooms(mappedRooms);
      setFacilityId(reservation.facilityId);
    } catch (err) {
      console.error("Error fetching facility data:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to load facility data";
      console.log("Setting snackbar error:", errorMessage);
      setError(errorMessage);

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [reservation?.facilityId]);

  // Pre-populate form with reservation details
  useEffect(() => {
    if (reservation && isEditable) {
      setDateRange({
        startDate: reservation.startDate ? dayjs(reservation.startDate) : null,
        endDate: reservation.endDate ? dayjs(reservation.endDate) : null,
      });
      setCustomerType(reservation.userType as CustomerType);
      setTotal(reservation.total);

      const packageItems: BookingItemDto[] = (
        reservation.reservedPackages || []
      ).map((pkg) => ({
        itemId: pkg.packageId,
        type: "package" as const,
        quantity: 1,
      }));
      const roomItems: BookingItemDto[] = (reservation.reservedRooms || []).map(
        (room) => ({
          itemId: room.roomTypeId,
          type: "room" as const,
          quantity: 1,
        })
      );
      setSelectedItems([...packageItems, ...roomItems]);

      fetchFacilityData();
    }
  }, [reservation, fetchFacilityData, isEditable]);

  // Handle date range changes
  const handleDateChange = (newDateRange: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }) => {
    setDateRange(newDateRange);
  };

  // Handle customer type changes
  const handleCustomerTypeChange = (type: CustomerType) => {};

  // Handle item selection changes
  const handleSelectionChange = (
    type: "package" | "room",
    id: number,
    quantity: number
  ) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find(
        (item) => item.type === type && item.itemId === id
      );
      if (quantity === 0) {
        return prev.filter(
          (item) => !(item.type === type && item.itemId === id)
        );
      }
      if (existingItem) {
        return prev.map((item) =>
          item.type === type && item.itemId === id
            ? { ...item, quantity }
            : item
        );
      }
      return [...prev, { itemId: id, type, quantity }];
    });
  };

  // Handle availability changes
  const handleAvailabilityChange = (response: AvailabilityResponseDto) => {
    setAvailability(response);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!reservation || !isEditable) return;

    // Validate form input
    const validationError = validateReservationForm(dateRange, selectedItems);
    if (validationError) {
      setError(validationError);
      return;
    }

    // At this point, we know both startDate and endDate are not null
    const startDate = dateRange.startDate!;
    const endDate = dateRange.endDate!;

    setLoading(true);
    setError(null);

    try {
      // Check what has changed to construct appropriate payload
      const originalStartDate = reservation.startDate
        ? dayjs(reservation.startDate)
        : null;
      const originalEndDate = reservation.endDate
        ? dayjs(reservation.endDate)
        : null;

      // Determine if dates have changed
      const datesChanged =
        !originalStartDate?.isSame(startDate, "day") ||
        !originalEndDate?.isSame(endDate, "day");

      // Prepare package updates
      const originalPackages = (reservation.reservedPackages || []).map(
        (pkg) => ({
          itemId: pkg.packageId,
          type: "package" as const,
          quantity: 1,
        })
      );

      // Prepare room updates
      const originalRooms = (reservation.reservedRooms || []).map((room) => ({
        itemId: room.roomTypeId,
        type: "room" as const,
        quantity: 1,
      }));

      // Check if packages or rooms have changed
      const packageItems = selectedItems.filter(
        (item) => item.type === "package"
      );
      const roomItems = selectedItems.filter((item) => item.type === "room");

      const packagesChanged = !areBookingItemsEqual(
        packageItems,
        originalPackages
      );
      const roomsChanged = !areBookingItemsEqual(roomItems, originalRooms);

      console.log("Changes detected:", {
        datesChanged,
        packagesChanged,
        roomsChanged,
      });

      // Construct the payload with only changed data
      const payload = {
        reservationId: reservation.reservationId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        total: total,
        packageUpdates: packageItems,
        roomUpdates: roomItems,
        userType: reservation.userType,

        // Add metadata to indicate what changed
        changes: {
          datesChanged,
          packagesChanged,
          roomsChanged,
        },
      };

      console.log("Sending update payload:", payload);

      // Validate payload before sending
      validateUpdateReservationPayload(payload);

      const response = await api.put(
        "/Reservation/update-reservation",
        payload
      );

      console.log("Update response:", response.data);

      // Check if we have a successful response
      if (response.data.reservationId) {
        // This means the update was successful
        setSnackbar({
          open: true,
          message: `Reservation #${reservation.reservationId} updated successfully`,
          severity: "success",
        });
        onSuccess();
        onClose();
        return;
      }

      // Handle validation errors from backend format
      if (response.data.Errors && response.data.Errors.length > 0) {
        const errorMessage = response.data.Errors.map((e) => e.Message).join(
          ", "
        );
        throw new Error(errorMessage);
      } else if (response.data.Message) {
        throw new Error(response.data.Message);
      } else if (!response.data.IsSuccess) {
        throw new Error("Failed to update reservation");
      }

      // If we get here, consider it a success
      setSnackbar({
        open: true,
        message: `Reservation #${reservation.reservationId} updated successfully`,
        severity: "success",
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating reservation:", err);

      let errorMessage = "Failed to update reservation";

      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;

        // Extract the specific error message from backend format
        if (responseData?.Errors && responseData.Errors.length > 0) {
          errorMessage = responseData.Errors.map((e: any) => e.Message).join(
            ", "
          );
        } else if (responseData?.Message) {
          errorMessage = responseData.Message;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Determine if submission is disabled
  const isSubmitDisabled = loading || !isEditable;

  // Reset state when dialog closes
  useEffect(() => {
    // When dialog closes or opens with new reservation, reset error and availability state
    if (!open) {
      setError(null);
      setAvailability({
        isAvailable: false,
        message: "",
      });
      setSnackbar((prev) => ({ ...prev, open: false }));
    }
  }, [open, reservation?.reservationId]);

  // Also modify the onClose handler to ensure state is cleared
  const handleClose = () => {
    setError(null);
    setAvailability({
      isAvailable: false,
      message: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Update Reservation #{reservation?.reservationId}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : !isEditable ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            This reservation cannot be updated due to its status (
            {reservation?.status}).
          </Alert>
        ) : (
          <Box>
            {/* Use the imported ReservationSummary component with type safety */}
            {reservation && <ReservationSummary reservation={reservation} />}

            <Typography variant="h6" sx={{ mb: 2 }}>
              Modify Reservation Details
            </Typography>

            {/* Add an informational alert about the customer type */}
            <Alert severity="info" sx={{ mb: 2 }}>
              Customer Type: <strong>{customerType.toUpperCase()}</strong>{" "}
              (cannot be changed after booking)
            </Alert>

            <BookingDateTimePicker
              dateRange={dateRange}
              onDateChange={handleDateChange}
              customerType={customerType}
              onCustomerTypeChange={handleCustomerTypeChange}
              required={true}
              facilityId={facilityId}
              selectedItems={selectedItems}
              onAvailabilityChange={handleAvailabilityChange}
              packages={packages}
            />
            <Box sx={{ mt: 3 }}>
              <SelectionTable
                packages={packages}
                rooms={rooms}
                onSelectionChange={handleSelectionChange}
                requiresDates={true}
                selectedItems={selectedItems}
                isAvailable={availability.isAvailable}
                availabilityMessage={availability.message}
                dateRange={dateRange}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <TotalSummary
                total={total}
                setTotal={setTotal}
                facilityId={facilityId}
                customerType={customerType}
                dateRange={dateRange}
                selectedItems={selectedItems}
                requiresDates={true}
                packages={packages}
              />
            </Box>
            {!availability.isAvailable && availability.message && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {availability.message}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
        >
          {loading ? <CircularProgress size={24} /> : "Update Reservation"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default UpdateReservationDialog;

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Divider,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { NavigateNext, ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { SelectedFacility, BookingItemDto } from "../types/selectedFacility";
import FacilityDetails from "../features/client/booking/components/FacilityDetails";
import BookingDatePicker from "../features/client/booking/components/BookingDatePicker";
import SelectionTable from "../features/client/booking/components/SelectionTable";
import TotalSummary from "../features/client/booking/components/TotalSummary";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import SignInPromptModal from "../features/client/booking/components/SignInPromptModal";
import { useFacilityMapper } from "../hooks/useFacilityMapper";
import { useBooking, DateRangeType } from "../hooks/useBooking";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { mapResponseToFacility } = useFacilityMapper();
  const [facility, setFacility] = useState<SelectedFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerType, setCustomerType] = useState<
    "corporate" | "public" | "private"
  >("public");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
  const [total, setTotal] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<BookingItemDto[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const { isAuthenticated } = useAuth();
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const navigate = useNavigate();

  // POTENTIAL ISSUE: The useBooking hook might be causing re-renders
  // Let's memoize the values to prevent infinite loops
  const bookingParams = useMemo(
    () => ({
      selectedItems,
      facility,
      dateRange,
      isAvailable,
    }),
    [selectedItems, facility, dateRange, isAvailable]
  );

  // Use our custom booking hook for validation logic with memoized params
  const { requiresDates, isReserveDisabled } = useBooking(
    bookingParams.selectedItems,
    bookingParams.facility,
    bookingParams.dateRange,
    bookingParams.isAvailable
  );

  // Memoize the fetchData function to prevent recreation on each render
  const fetchFacilityData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const facilityId = parseInt(id, 10);
      if (isNaN(facilityId)) {
        setLoading(false);
        return;
      }

      const response = await api.get(`/Reservation/${facilityId}`);

      if (response.data?.isSuccess) {
        setFacility(mapResponseToFacility(response.data));
      }
    } catch (error) {
      console.error("Error fetching facility:", error);
    } finally {
      setLoading(false);
    }
  }, [id, mapResponseToFacility]);

  // Fetch facility data only when component mounts or id changes
  useEffect(() => {
    // Only fetch when we have an ID
    if (id) {
      fetchFacilityData();
    }
  }, [id, fetchFacilityData]);

  // Handle reservation and store reservation data temporarily
  const handleReservation = useCallback(() => {
    if (!facility) return;

    const reservationData = {
      facilityId: facility.id,
      selectedItems,
      total,
      customerType,
      startDate: dateRange.startDate?.toISOString(),
      endDate: dateRange.endDate?.toISOString(),
    };

    localStorage.setItem("currentReservation", JSON.stringify(reservationData));
  }, [facility, selectedItems, total, customerType, dateRange]);

  const handleReserveNow = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!isAuthenticated) {
        setSignInModalOpen(true);
        return;
      }
      handleReservation();
      navigate("/userinfo", { state: { facilityId: facility?.id } });
    },
    [isAuthenticated, handleReservation, navigate, facility?.id]
  );

  // Handle selection changes for packages and rooms
  const handleSelectionChange = useCallback(
    (type: "package" | "room", id: number, quantity: number) => {
      setSelectedItems((prev) => {
        // First filter out any existing item with the same type and id
        const filtered = prev.filter(
          (item) => !(item.type === type && item.itemId === id)
        );

        // If quantity > 0, add the new item
        if (quantity > 0) {
          return [...filtered, { type, itemId: id, quantity }];
        }

        return filtered;
      });
    },
    []
  );

  const handleDateChange = useCallback((newDateRange: DateRangeType) => {
    setDateRange(newDateRange);
  }, []);

  const handleCustomerTypeChange = useCallback(
    (type: "corporate" | "public" | "private") => {
      setCustomerType(type);
    },
    []
  );

  const handleAvailabilityChange = useCallback((availability: boolean) => {
    setIsAvailable(availability);
  }, []);

  // Close sign-in modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated && signInModalOpen) {
      setSignInModalOpen(false);
    }
  }, [isAuthenticated, signInModalOpen]);

  // Render the loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading facility details...</Typography>
      </Container>
    );
  }

  // Render the error state when facility is not found
  if (!facility) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Facility not found.
        </Typography>
        <Button
          component={Link}
          to="/facilities"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Facilities
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          to="/facilities"
          underline="hover"
          color="inherit"
        >
          Facilities
        </MuiLink>
        <Typography color="text.primary">Booking: {facility.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <FacilityDetails facility={facility} />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Booking details section */}
      <Typography variant="h6" gutterBottom>
        Select Booking Details
      </Typography>
      <BookingDatePicker
        dateRange={dateRange}
        onDateChange={handleDateChange}
        customerType={customerType}
        onCustomerTypeChange={handleCustomerTypeChange}
        required={requiresDates}
        facilityId={facility.id}
        selectedItems={selectedItems}
        onAvailabilityChange={handleAvailabilityChange}
      />

      <Divider sx={{ my: 3 }} />

      {/* Selection table */}
      <SelectionTable
        packages={facility.packages || []}
        rooms={facility.rooms || []}
        onSelectionChange={handleSelectionChange}
        requiresDates={requiresDates}
        selectedItems={selectedItems}
      />

      <Divider sx={{ my: 3 }} />

      {/* Total summary */}
      <TotalSummary
        total={total}
        setTotal={setTotal}
        facilityId={facility.id}
        customerType={customerType}
        dateRange={dateRange}
        selectedItems={selectedItems}
        requiresDates={requiresDates}
      />

      {/* Action buttons */}
      <Button
        variant="contained"
        color="success"
        onClick={handleReserveNow}
        disabled={isReserveDisabled()}
        sx={{ mt: 1 }}
      >
        Reserve Now
      </Button>

      <SignInPromptModal
        open={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />

      <Divider sx={{ my: 3 }} />
    </Container>
  );
};

export default BookingPage;

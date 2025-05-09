import { useState, useEffect, useCallback } from "react";
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
import { Dayjs } from "dayjs";
import {
  PackagesDto,
  pricingDto,
  RoomPricingDto,
  SelectedFacility,
  ApiResponse,
  BookingItemDto,
  RoomResponseDto,
  AvailabilityResponseDto,
} from "../types/selectedFacility";
import FacilityDetails from "../features/client/booking/components/FacilityDetails";
import BookingDatePicker from "../features/client/booking/components/BookingDatePicker";
import SelectionTable from "../features/client/booking/components/SelectionTable";
import TotalSummary from "../features/client/booking/components/TotalSummary";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import SignInPromptModal from "../features/client/booking/components/SignInPromptModal";
import UnavailabilityWarningDialog from "../features/client/booking/components/UnavailabilityWarningDialog";

// Interface for date range with start and end dates
interface DateRangeType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

/**
 * Helper function to convert time span from API (in format HH:mm:ss) to a readable string
 * For example: "24:00:00" becomes "1 day", "10:30:00" becomes "10 hours 30 minutes"
 * @param timeSpan - Time span in format "HH:mm:ss"
 * @returns Formatted time string or undefined if no timeSpan provided
 */
const convertTimeSpanToString = (timeSpan: string) => {
  if (!timeSpan) return undefined;

  const [hours, minutes] = timeSpan.split(":").map(Number);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} day${days > 1 ? "s" : ""}${
      remainingHours > 0
        ? ` ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
        : ""
    }`;
  }
  const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
  return [hourString, minuteString].filter(Boolean).join(" ");
};

/**
 * Helper function to extract hours as a number from time span string
 * Used to determine if a package requires date selection (>= 24 hours)
 * @param timeSpan - Time span in format "HH:mm:ss"
 * @returns Hours as a number
 */
const convertHoursToNumbers = (timeSpan: string) => {
  if (!timeSpan) return 0;
  const [hours] = timeSpan.split(":");
  return parseInt(hours, 10);
};

/**
 * Maps API response to a format the UI components can use
 * Transforms raw facility data into a structured SelectedFacility object
 * @param response - API response containing facility data
 * @returns Formatted SelectedFacility object
 */
const mapResponseToFacility = (response: ApiResponse): SelectedFacility => {
  // Return empty facility if response is invalid
  if (!response?.value) {
    return {
      id: 0,
      name: "",
      location: "",
      description: "No data available",
      images: [],
      amenities: [],
      packages: [],
      rooms: [],
    };
  }

  // Transform API response into UI-friendly format
  return {
    id: response.value.facilityId,
    name: response.value.facilityName,
    location: response.value.location,
    description: response.value.description || "No description available",
    images: response.value.imageUrls || [],
    amenities: response.value.attributes || [],
    // Map packages array, transforming duration into readable format
    packages:
      response.value.packages?.map((pkg: PackagesDto) => ({
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        duration: pkg.duration
          ? convertTimeSpanToString(pkg.duration)
          : undefined,
        // Determine if package requires date selection (if duration ≥ 24 hours)
        requiresDates: pkg.duration
          ? convertHoursToNumbers(pkg.duration) >= 24
          : false,
        pricing:
          pkg.pricing?.map((price: pricingDto) => ({
            sector: price.sector,
            price: price.price,
          })) || [],
      })) || [],
    // Map rooms array, keeping room type and pricing information
    rooms:
      response.value.rooms?.map((room: RoomResponseDto) => ({
        roomTypeId: room.roomTypeId,
        roomType: room.roomType,
        roomPricing:
          room.roomPricing?.map((price: RoomPricingDto) => ({
            sector: price.sector,
            price: price.price,
          })) || [],
      })) || [],
  };
};

/**
 * BookingPage Component
 * Handles the complete facility booking flow including:
 * - Facility details display
 * - Date selection
 * - Package/room selection
 * - Price calculation
 * - Availability checking
 * - Reservation creation
 */
const BookingPage = () => {
  // Get facility ID from URL parameters
  const { id } = useParams<{ id: string }>();

  // State for facility data and UI state management
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
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [unavailabilityWarningOpen, setUnavailabilityWarningOpen] =
    useState(false);

  // Authentication context for checking if user is signed in
  const { isAuthenticated } = useAuth();
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles availability change from BookingDatePicker
   * Updates availability state based on API response
   */
  const handleAvailabilityChange = useCallback(
    (availabilityResponse: AvailabilityResponseDto) => {
      // Update availability state based on response from server
      setIsAvailable(availabilityResponse.isAvailable);
      // Store the availability message
      setAvailabilityMessage(availabilityResponse.message);
    },
    []
  );

  /**
   * Determines if date selection is required based on selected items
   * Rooms always require dates, packages only if duration ≥ 24 hours
   */
  const requiresDates = selectedItems.some(
    (item) =>
      item.type === "room" ||
      facility?.packages.find((p) => p.packageId === item.itemId)?.requiresDates
  );

  /**
   * Validates if selected dates are valid:
   * - No validation needed if dates aren't required
   * - Otherwise, both dates must be selected and end date must be after start date
   */
  const validateDates = useCallback(() => {
    if (!requiresDates) return true;
    return (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.endDate.isAfter(dateRange.startDate)
    );
  }, [dateRange.endDate, dateRange.startDate, requiresDates]);

  /**
   * Checks if any package or room is selected (required for a valid reservation)
   */
  const hasSelectedItems = useCallback(() => {
    return selectedItems.length > 0;
  }, [selectedItems]);

  /**
   * Determines if the "Reserve Now" button should be disabled
   * Button is disabled if:
   * - No items are selected (neither packages nor rooms)
   * - Required dates are invalid when rooms or daily packages are selected
   */
  const isReserveDisabled = useCallback(() => {
    // Disable if no items are selected or dates are invalid when required
    return !hasSelectedItems() || (requiresDates && !validateDates());
  }, [hasSelectedItems, validateDates, requiresDates]);

  /**
   * Prepares reservation data and stores it in localStorage
   * This allows the data to persist between pages in the booking flow
   */
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

    // Store reservation data in localStorage for access in the next step
    localStorage.setItem("currentReservation", JSON.stringify(reservationData));
  }, [facility, selectedItems, total, customerType, dateRange]);

  /**
   * Handles the "Reserve Now" button click
   * - Shows login prompt if user is not authenticated
   * - Otherwise, saves reservation data and navigates to user info page
   */
  const handleReserveNow = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      // Check if items are selected but not available
      if (selectedItems.length > 0 && !isAvailable) {
        // Show unavailability warning
        setUnavailabilityWarningOpen(true);
        return;
      }

      if (!isAuthenticated) {
        // Show sign-in modal if user is not logged in
        setSignInModalOpen(true);
        return;
      }

      // Save reservation data and proceed to user info page
      handleReservation();
      navigate("/userinfo", { state: { facilityId: facility?.id } });
    },
    [
      isAuthenticated,
      isAvailable,
      selectedItems,
      handleReservation,
      navigate,
      facility,
    ]
  );

  /**
   * Handles selection changes for packages and rooms
   * Updates selectedItems state, filtering out existing items and adding new ones
   */
  const handleSelectionChange = useCallback(
    (type: "package" | "room", id: number, quantity: number) => {
      setSelectedItems((prev) => {
        // Remove the existing item of this type/id if any
        const filteredItems = prev.filter(
          (item) => !(item.type === type && item.itemId === id)
        );
        // Only add the item if quantity > 0
        if (quantity > 0) {
          return [...filteredItems, { type, itemId: id, quantity }];
        }
        return filteredItems;
      });
    },
    []
  );

  /**
   * Fetches facility details from the API when component mounts or ID changes
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const facilityId = parseInt(id || "", 10);
        if (!isNaN(facilityId)) {
          // Fetch facility data from API
          const response = await axios.get(
            `http://localhost:5162/api/Reservation/${facilityId}`
          );

          if (response.data.isSuccess) {
            // Transform API response to UI model
            const mappedFacility = mapResponseToFacility(response.data);
            setFacility(mappedFacility);
          }
        }
      } catch (error) {
        console.error("Error fetching facility:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /**
   * Updates date range when date picker values change
   */
  const handleDateChange = useCallback((newDateRange: DateRangeType) => {
    setDateRange(newDateRange);
  }, []);

  /**
   * Updates customer type when selection changes
   */
  const handleCustomerTypeChange = useCallback(
    (type: "corporate" | "public" | "private") => {
      setCustomerType(type);
    },
    []
  );

  /**
   * Close sign-in modal when user authenticates
   */
  useEffect(() => {
    if (isAuthenticated && signInModalOpen) {
      setSignInModalOpen(false);
    }
  }, [isAuthenticated, signInModalOpen]);

  // Show loading indicator while fetching facility data
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading facility details...</Typography>
      </Container>
    );
  }

  // Show error message if facility not found
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

  // Main booking page layout
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb navigation */}
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

      {/* Facility details section */}
      <Box sx={{ mb: 4 }}>
        <FacilityDetails facility={facility} />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Date selection section */}
      <Typography variant="h6" gutterBottom>
        Select Booking Details
      </Typography>
      <BookingDatePicker
        dateRange={dateRange}
        onDateChange={handleDateChange}
        customerType={customerType}
        onCustomerTypeChange={handleCustomerTypeChange}
        required={requiresDates}
        facilityId={facility?.id}
        selectedItems={selectedItems}
        onAvailabilityChange={handleAvailabilityChange}
      />

      <Divider sx={{ my: 3 }} />

      {/* Package and room selection section */}
      <SelectionTable
        packages={facility?.packages || []}
        rooms={facility?.rooms || []}
        onSelectionChange={handleSelectionChange}
        requiresDates={requiresDates}
        selectedItems={selectedItems}
        isAvailable={isAvailable}
        availabilityMessage={availabilityMessage}
        dateRange={dateRange}
      />

      <Divider sx={{ my: 3 }} />

      {/* Price calculation section */}
      <TotalSummary
        total={total}
        setTotal={setTotal}
        facilityId={facility?.id}
        customerType={customerType}
        dateRange={dateRange}
        selectedItems={selectedItems}
        requiresDates={requiresDates}
      />

      {/* Reserve button */}
      <Button
        variant="contained"
        color="success"
        onClick={handleReserveNow}
        disabled={isReserveDisabled()}
        sx={{ mt: 1 }}
      >
        Reserve Now
      </Button>

      <UnavailabilityWarningDialog
        open={unavailabilityWarningOpen}
        onClose={() => setUnavailabilityWarningOpen(false)}
        message={availabilityMessage}
      />

      {/* Sign-in modal (shown when unauthenticated user tries to book) */}
      <SignInPromptModal
        open={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
      <Divider sx={{ my: 3 }} />
    </Container>
  );
};

export default BookingPage;

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
import BookingDateTimePicker from "../features/client/booking/components/BookingDateTimePicker";
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

// Helper functions to convert time span to string and hours to numbers
const convertTimeSpanToString = (timeSpan: string) => {
  if (!timeSpan) return undefined;

  // Check if the time span includes days (format: "d.hh:mm:ss")
  if (timeSpan.includes(".")) {
    const [days, timeComponent] = timeSpan.split(".");
    const [hours] = timeComponent.split(":").map(Number);

    const daysNum = parseInt(days, 10);
    return `${daysNum} day${daysNum > 1 ? "s" : ""}${
      hours > 0 ? ` ${hours} hour${hours > 1 ? "s" : ""}` : ""
    }`;
  }

  // Standard format "hh:mm:ss"
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

const convertHoursToNumbers = (timeSpan: string) => {
  if (!timeSpan) return 0;

  // Check if the time span includes days (format: "d.hh:mm:ss")
  if (timeSpan.includes(".")) {
    const [days, timeComponent] = timeSpan.split(".");
    const [hours] = timeComponent.split(":").map(Number);
    return parseInt(days, 10) * 24 + hours;
  }

  // Standard format "hh:mm:ss"
  const [hours] = timeSpan.split(":");
  return parseInt(hours, 10);
};

const mapResponseToFacility = (response: ApiResponse): SelectedFacility => {
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
  return {
    id: response.value.facilityId,
    name: response.value.facilityName,
    location: response.value.location,
    description: response.value.description || "No description available",
    images: response.value.imageUrls || [],
    amenities: response.value.attributes || [],
    packages:
      response.value.packages?.map((pkg: PackagesDto) => ({
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        duration: pkg.duration
          ? typeof pkg.duration === "string"
            ? convertTimeSpanToString(pkg.duration)
            : `${Math.floor(Number(pkg.duration) / 24)} day${Math.floor(Number(pkg.duration) / 24) !== 1 ? "s" : ""}`
          : undefined,
        requiresDates: pkg.duration
          ? typeof pkg.duration === "string"
            ? convertHoursToNumbers(pkg.duration) >= 24
            : Number(pkg.duration) >= 24
          : false,
        pricing:
          pkg.pricing?.map((price: pricingDto) => ({
            sector: price.sector,
            price: price.price,
          })) || [],
      })) || [],
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

// BookingPage Component
const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
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
  const { isAuthenticated } = useAuth();
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAvailabilityChange = useCallback(
    (availabilityResponse: AvailabilityResponseDto) => {
      setIsAvailable(availabilityResponse.isAvailable);
      setAvailabilityMessage(availabilityResponse.message);
    },
    []
  );

  const requiresDates = selectedItems.some(
    (item) =>
      item.type === "room" ||
      facility?.packages.find((p) => p.packageId === item.itemId)?.requiresDates
  );

  const validateDates = useCallback(() => {
    if (!requiresDates) return true;
    return (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.endDate.isAfter(dateRange.startDate)
    );
  }, [dateRange, requiresDates]);

  const hasSelectedItems = useCallback(() => {
    return selectedItems.length > 0;
  }, [selectedItems]);

  const isReserveDisabled = useCallback(() => {
    return !hasSelectedItems() || (requiresDates && !validateDates());
  }, [hasSelectedItems, validateDates, requiresDates]);

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
      if (selectedItems.length > 0 && !isAvailable) {
        setUnavailabilityWarningOpen(true);
        return;
      }
      if (!isAuthenticated) {
        setSignInModalOpen(true);
        return;
      }
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

  const handleSelectionChange = useCallback(
    (type: "package" | "room", id: number, quantity: number) => {
      setSelectedItems((prev) => {
        const filteredItems = prev.filter(
          (item) => !(item.type === type && item.itemId === id)
        );
        if (quantity > 0) {
          return [...filteredItems, { type, itemId: id, quantity }];
        }
        return filteredItems;
      });
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const facilityId = parseInt(id || "", 10);
        if (!isNaN(facilityId)) {
          const response = await axios.get(
            `http://localhost:5162/api/Reservation/${facilityId}`
          );
          if (response.data.isSuccess) {
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

  const handleDateChange = useCallback((newDateRange: DateRangeType) => {
    setDateRange(newDateRange);
  }, []);

  const handleCustomerTypeChange = useCallback(
    (type: "corporate" | "public" | "private") => {
      setCustomerType(type);
    },
    []
  );

  useEffect(() => {
    if (isAuthenticated && signInModalOpen) {
      setSignInModalOpen(false);
    }
  }, [isAuthenticated, signInModalOpen]);

  // Early return for loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading facility details...</Typography>
      </Container>
    );
  }

  // Early return for error state (facility not found)
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

  // Main content
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
      <Typography variant="h6" gutterBottom>
        Select Booking Details
      </Typography>
      <BookingDateTimePicker
        dateRange={dateRange}
        onDateChange={handleDateChange}
        customerType={customerType}
        onCustomerTypeChange={handleCustomerTypeChange}
        required={requiresDates}
        facilityId={facility.id}
        selectedItems={selectedItems}
        onAvailabilityChange={handleAvailabilityChange}
        packages={facility.packages}
      />
      <Divider sx={{ my: 3 }} />
      <SelectionTable
        packages={facility.packages || []}
        rooms={facility.rooms || []}
        onSelectionChange={handleSelectionChange}
        requiresDates={requiresDates}
        selectedItems={selectedItems}
        isAvailable={isAvailable}
        availabilityMessage={availabilityMessage}
        dateRange={dateRange}
      />
      <Divider sx={{ my: 3 }} />
      <TotalSummary
        total={total}
        setTotal={setTotal}
        facilityId={facility.id}
        customerType={customerType}
        dateRange={dateRange}
        selectedItems={selectedItems}
        requiresDates={requiresDates}
      />
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
      <SignInPromptModal
        open={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
      <Divider sx={{ my: 3 }} />
    </Container>
  );
};

export default BookingPage;

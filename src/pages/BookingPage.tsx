import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
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
  RoomDto,
  RoomPricingDto,
  SelectedFacility,
  ApiResponse,
  BookingItemDto,
} from "../types/selectedFacility";
import FacilityDetails from "../features/client/booking/components/FacilityDetails";
import BookingDatePicker from "../features/client/booking/components/BookingDatePicker";
import SelectionTable from "../features/client/booking/components/SelectionTable";
import TotalSummary from "../features/client/booking/components/TotalSummary";
import axios from "axios";

interface DateRangeType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

// map backend response to Facility type
const mapResponseToFacility = (response: ApiResponse): SelectedFacility => ({
  id: response.value.facilityId,
  name: response.value.facilityName,
  location: response.value.location,
  description: response.value.description || "No description available",
  images: response.value.imageUrls || [],
  amenities: Object.entries(response.value.attributes || {}).map(
    ([key, val]) => `${key}: ${val}`
  ),
  packages:
    response.value.packages?.map((pkg: PackagesDto) => ({
      packageId: pkg.packageId,
      packageName: pkg.packageName,
      duration: pkg.duration
        ? convertTimeSpanToString(pkg.duration)
        : undefined,

      requiresDates: pkg.duration
        ? convertHoursToNumbers(pkg.duration) >= 24
        : false,
      pricing: pkg.pricing.map((price: pricingDto) => ({
        sector: price.sector,
        price: price.price,
      })),
    })) || [],
  rooms:
    response.value.rooms?.map((room: RoomDto) => ({
      roomId: room.roomId,
      roomType: room.roomType,
      pricing: room.pricing.map((price: RoomPricingDto) => ({
        sector: price.sector,
        price: price.price,
      })),
    })) || [],
});

// helper function to convert time span to string
const convertTimeSpanToString = (timeSpan: string) => {
  const [hours, minutes] = timeSpan.split(":").map(Number);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} day${days > 1 ? "s" : ""}${remainingHours > 0 ? ` ${remainingHours} hour${remainingHours > 1 ? "s" : ""}` : ""}`;
  }
  const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
  return [hourString, minuteString].filter(Boolean).join(" ");
};

// helper function to convert hours to numbers
const convertHoursToNumbers = (timeSpan: string) => {
  const [hours] = timeSpan.split(":");
  return parseInt(hours, 10);
};

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

  const requiresDates = selectedItems.some(
    (item) =>
      item.type === "room" ||
      facility?.packages.find((p) => p.packageId === item.itemId)?.requiresDates
  );

  // handle selection changes for packages and rooms
  const handleSelectionChange = (
    type: "package" | "room",
    id: number,
    quantity: number
  ) => {
    setSelectedItems((prev) => [
      ...prev.filter((item) => item.type === type && item.itemId === id),
      ...(quantity > 0 ? [{ type, itemId: id, quantity }] : []),
    ]);
  };

  const calculateTotal = useCallback(async () => {
    if (requiresDates && (!dateRange.startDate || !dateRange.endDate)) {
      console.error("Start date and end date are required.");
      return;
    }

    if (
      dateRange.startDate &&
      dateRange.endDate &&
      !dateRange.endDate.isAfter(dateRange.startDate)
    ) {
      console.error(
        "Invalid date range: End date must be after the start date."
      );
      return;
    }

    try {
      const payload = {
        calculateTotalDto: {
          facilityId: facility?.id,
          customerType,
          startDate: dateRange.startDate?.toISOString(),
          endDate: dateRange.endDate?.toISOString(),
          selectedItems,
        },
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        "http://localhost:5162/api/Reservation/calculateTotal",
        payload
      );

      setTotal(response.data.value.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      }
      console.error("Error calculating total:", error);
    }
  }, [facility, customerType, dateRange, selectedItems, requiresDates]);

  // calculate total when selected items or date range changes
  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  // fetch facility data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityId = parseInt(id || "", 10);
        if (!isNaN(facilityId)) {
          const response = await axios.get(
            `http://localhost:5162/api/Reservation/${facilityId}`
          );

          if (response.data.isSuccess) {
            setFacility(mapResponseToFacility(response.data));
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

  const handleDateChange = (newDateRange: DateRangeType) => {
    setDateRange(newDateRange);
  };

  const handleCustomerTypeChange = (
    type: "corporate" | "public" | "private"
  ) => {
    setCustomerType(type);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading facility details...</Typography>
      </Container>
    );
  }

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

      {/* display booking date picker and customer type selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Booking Details
        </Typography>
        <BookingDatePicker
          dateRange={dateRange}
          onDateChange={handleDateChange}
          customerType={customerType}
          onCustomerTypeChange={handleCustomerTypeChange}
          required={requiresDates}
        />
      </Paper>

      {/* display packages and rooms*/}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SelectionTable
          packages={facility?.packages || []}
          rooms={facility?.rooms || []}
          onSelectionChange={handleSelectionChange}
          requiresDates={requiresDates}
        />
      </Paper>

      {/* display total price */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <TotalSummary total={total} />
      </Paper>
    </Container>
  );
};

export default BookingPage;

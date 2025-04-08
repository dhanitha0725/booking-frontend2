import { useState, useEffect } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import {
  PackagesDto,
  pricingDto,
  RoomDto,
  RoomPricingDto,
  SelectedFacility,
  ApiResponse,
} from "../types/selectedFacility";
import FacilityDetails from "../features/client/booking/components/FacilityDetails";
import BookingDatePicker from "../features/client/booking/components/BookingDatePicker";
import SelectionTable from "../features/client/booking/components/SelectionTable";
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
  const [hours, minutes] = timeSpan.split(":");
  return `${hours} hours ${minutes} minutes`;
};

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<SelectedFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerType, setCustomerType] = useState<
    "corporate" | "public" | "private"
  >("public");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
  });

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
        />
      </Paper>
      {/* display packages and rooms*/}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SelectionTable packages={facility.packages} rooms={facility.rooms} />
      </Paper>
    </Container>
  );
};

export default BookingPage;

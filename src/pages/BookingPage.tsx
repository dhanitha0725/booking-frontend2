import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Facility } from "../types/facility";
import FacilityDetails from "../features/client/booking/components/FacilityDetails";
import BookingDatePicker from "../features/client/booking/components/BookingDatePicker";
import { getFacilityById } from "../data/facilitiesData";

interface DateRangeType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerType, setCustomerType] = useState<
    "corporate" | "public" | "private"
  >("public");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityId = parseInt(id || "", 10);
        if (!isNaN(facilityId)) {
          const data = getFacilityById(facilityId);
          setFacility(data || null);
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
    setSelectedItems([]);
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

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!dateRange.startDate || !dateRange.endDate}
            onClick={() =>
              navigate("/payment", {
                state: { facility, selectedItems, dateRange, customerType },
              })
            }
          >
            Proceed to Payment
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingPage;

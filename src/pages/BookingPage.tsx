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
import { CustomerType } from "../features/client/booking/component/customerTypes";
import FacilityDetails from "../features/client/booking/component/FacilityDetails";
import BookingDatePicker from "../features/client/booking/component/BookingDatePicker";
import { CustomerTypeSelector } from "../features/client/booking/component/customerTypes";
import SelectionTable from "../features/client/booking/component/SelectionTable";
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
  const [customerType, setCustomerType] = useState<CustomerType>("walk-in");
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

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    setSelectedItems([]);
  };

  const calculateDuration = (): number => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    return dateRange.endDate.diff(dateRange.startDate, "day") + 1;
  };

  const duration = calculateDuration();

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

  // Transform facility data for SelectionTable
  const selectionItems =
    facility.packages?.map((pkg) => ({
      facilityName: pkg.name,
      defaultDuration: 24, // Assuming daily packages
      pricing: {
        ...pkg.pricing,
        perDay: pkg.pricing[customerType as keyof typeof pkg.pricing] || 0, // Add perDay pricing based on customer type
      },
    })) || [];

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
          Select Dates
        </Typography>
        <BookingDatePicker
          dateRange={dateRange}
          onDateChange={handleDateChange}
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Customer Type
        </Typography>
        <CustomerTypeSelector
          customerType={customerType}
          onCustomerTypeChange={handleCustomerTypeChange}
        />
      </Paper>

      {facility.packages && facility.packages.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Available Packages
          </Typography>
          <SelectionTable
            items={selectionItems}
            duration={duration}
            customerType={customerType}
            dateRange={[
              dateRange.startDate?.toDate() || new Date(),
              dateRange.endDate?.toDate() || new Date(),
            ]}
            onSelectionChange={(itemId, selected) => {
              setSelectedItems((prev) =>
                selected
                  ? [...prev, String(itemId)]
                  : prev.filter((id) => id !== String(itemId))
              );
            }}
          />
        </Paper>
      )}

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={
              !dateRange.startDate ||
              !dateRange.endDate ||
              selectedItems.length === 0
            }
            onClick={() =>
              navigate("/payment", {
                state: { facility, selectedItems, dateRange },
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

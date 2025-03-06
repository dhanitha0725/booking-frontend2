import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Breadcrumbs,
  FormHelperText,
  Alert,
  Divider,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import {
  NavigateNext,
  ArrowBack,
  AccessTime,
  Event,
  People,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { format, addHours, isAfter } from "date-fns";

// Import components
import BookingSummary from "../features/booking/components//BookingSummary";
import DocumentUpload from "../features/booking/components//DocumentUpload";

// Mock data for a facility
import { facilityData } from "../data/mockData";
import { JSX } from "react/jsx-runtime";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [facility, setFacility] = useState<typeof facilityData | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [customerType, setCustomerType] = useState("public");
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  interface FormErrors {
    date?: string;
    startTime?: string;
    endTime?: string;
    customerType?: string;
    eventType?: string;
    guestCount?: string;
    name?: string;
    email?: string;
    phone?: string;
  }
  const [errors, setErrors] = useState<FormErrors>({});

  // Load facility data
  useEffect(() => {
    // In a real app, you would fetch the facility based on ID
    setFacility(facilityData);
    setLoading(false);
  }, [id]);

  const steps = ["Booking Details", "Customer Information", "Review & Confirm"];

  const validateStep = () => {
    const newErrors: FormErrors = {};

    if (activeStep === 0) {
      if (!date) newErrors.date = "Date is required";
      if (!startTime) newErrors.startTime = "Start time is required";
      if (!endTime) newErrors.endTime = "End time is required";
      if (startTime && endTime && !isAfter(endTime, startTime)) {
        newErrors.endTime = "End time must be after start time";
      }
      if (!customerType) newErrors.customerType = "Customer type is required";
      if (!eventType) newErrors.eventType = "Event type is required";
      if (!guestCount) {
        newErrors.guestCount = "Guest count is required";
      } else {
        const count = parseInt(guestCount);
        if (facility) {
          const [minCapacity, maxCapacity] = facility.capacity
            .split("-")
            .map((n) => parseInt(n));
          if (count < minCapacity || count > maxCapacity) {
            newErrors.guestCount = `Guest count must be between ${minCapacity} and ${maxCapacity}`;
          }
        }
      }
    }

    if (activeStep === 1) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email))
        newErrors.email = "Email is invalid";
      if (!phone.trim()) newErrors.phone = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        // Submit booking and navigate to payment
        navigate(`/payment/${id}`, {
          state: {
            booking: {
              facility,
              date,
              startTime: startTime ? format(startTime, "HH:mm") : "",
              endTime: endTime ? format(endTime, "HH:mm") : "",
              customerType,
              eventType,
              guestCount,
              name,
              email,
              phone,
              specialRequests,
            },
          },
        });
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!facility) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Facility not found</Typography>
        <Button component={Link} to="/facilities" startIcon={<ArrowBack />}>
          Back to Facilities
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link
            to="/facilities"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Facilities
          </Link>
          <Link
            to={`/facilities/${id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {facility.name}
          </Link>
          <Typography color="text.primary">Book</Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          component={Link}
          to={`/facilities/${id}`}
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Back to Facility
        </Button>

        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Book {facility.name}
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Step 1: Booking Details */}
            {activeStep === 0 && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Booking Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Booking Date"
                        value={date}
                        onChange={(newValue) => {
                          setDate(newValue);
                          setErrors({ ...errors, date: "" });
                        }}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.date,
                            helperText: errors.date,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="Start Time"
                        value={startTime}
                        onChange={(newValue) => {
                          setStartTime(newValue);
                          setErrors({ ...errors, startTime: "" });

                          // Auto set end time to start time + 2 hours if not already set
                          if (newValue && !endTime) {
                            setEndTime(addHours(newValue, 2));
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.startTime}
                            helperText={errors.startTime}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="End Time"
                        value={endTime}
                        onChange={(newValue) => {
                          setEndTime(newValue);
                          setErrors({ ...errors, endTime: "" });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.endTime}
                            helperText={errors.endTime}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.customerType}>
                      <InputLabel id="customer-type-label">
                        Customer Type
                      </InputLabel>
                      <Select
                        labelId="customer-type-label"
                        value={customerType}
                        label="Customer Type"
                        onChange={(e) => {
                          setCustomerType(e.target.value);
                          setErrors({ ...errors, customerType: "" });
                        }}
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                        <MenuItem value="corporate">Corporate</MenuItem>
                      </Select>
                      {errors.customerType && (
                        <FormHelperText>{errors.customerType}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.eventType}>
                      <InputLabel id="event-type-label">Event Type</InputLabel>
                      <Select
                        labelId="event-type-label"
                        value={eventType}
                        label="Event Type"
                        onChange={(e) => {
                          setEventType(e.target.value);
                          setErrors({ ...errors, eventType: "" });
                        }}
                      >
                        <MenuItem value="wedding">Wedding</MenuItem>
                        <MenuItem value="corporate">Corporate Event</MenuItem>
                        <MenuItem value="conference">Conference</MenuItem>
                        <MenuItem value="birthday">Birthday Party</MenuItem>
                        <MenuItem value="meeting">Meeting</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                      {errors.eventType && (
                        <FormHelperText>{errors.eventType}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number of Guests"
                      value={guestCount}
                      onChange={(e) => {
                        setGuestCount(e.target.value);
                        setErrors({ ...errors, guestCount: "" });
                      }}
                      error={!!errors.guestCount}
                      helperText={
                        errors.guestCount ||
                        `This facility can accommodate ${facility.capacity} people`
                      }
                      InputProps={{
                        inputProps: {
                          min: 1,
                          max: parseInt(facility.capacity.split("-")[1]),
                        },
                        startAdornment: (
                          <People sx={{ color: "action.active", mr: 1 }} />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Special Requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements or setup instructions..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Step 2: Customer Information */}
            {activeStep === 1 && (
              <Box>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors({ ...errors, name: "" });
                        }}
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors({ ...errors, email: "" });
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrors({ ...errors, phone: "" });
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Document Upload Section (conditionally rendered based on customer type) */}
                {(customerType === "corporate" ||
                  customerType === "private") && (
                  <DocumentUpload customerType={customerType} />
                )}
              </Box>
            )}

            {/* Step 3: Review & Confirm */}
            {activeStep === 2 && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Review Booking
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                  Please review your booking details before proceeding to
                  payment.
                </Alert>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{name}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{email}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Phone:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{phone}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <BookingSummary
                    bookingData={{
                      facility,
                      date,
                      startTime: startTime ? format(startTime, "HH:mm") : "",
                      endTime: endTime ? format(endTime, "HH:mm") : "",
                      customerType,
                      eventType,
                      guestCount: parseInt(guestCount) || 0,
                      specialRequests,
                    }}
                  />
                </Box>
              </Paper>
            )}

            {/* Navigation Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1
                  ? "Proceed to Payment"
                  : "Next"}
              </Button>
            </Box>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: 20 }}>
              {/* Facility Mini Card */}
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    height: 150,
                    backgroundImage: `url(${facility.images[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {facility.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {facility.location}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <People
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      Capacity: {facility.capacity}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AccessTime
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      Hours: {facility.hours}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Pricing Card */}
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pricing ({customerType ? customerType : "public"})
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Hourly Rate:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {customerType && facility.pricing[customerType]
                        ? facility.pricing[customerType].hourly
                        : facility.pricing.public.hourly}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Setup Fee:</Typography>
                    <Typography variant="body2">
                      {customerType && facility.pricing[customerType]
                        ? facility.pricing[customerType].setup
                        : facility.pricing.public.setup}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Cleaning Fee:</Typography>
                    <Typography variant="body2">
                      {customerType && facility.pricing[customerType]
                        ? facility.pricing[customerType].cleaning
                        : facility.pricing.public.cleaning}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    bgcolor: "background.default",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Event sx={{ fontSize: 20, mr: 1 }} />
                    Select your date and time to see the total price
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingPage;

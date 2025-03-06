import { useState, useEffect, SetStateAction } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  People,
  Check,
  Event,
  ArrowBack,
  Close,
  NavigateNext,
  CalendarMonth,
  Star,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

// Mock data for a single facility
const facilityData = {
  id: 1,
  name: "Grand Ballroom",
  type: "hall",
  description:
    "Our Grand Ballroom is a versatile and elegant space perfect for weddings, corporate events, and large gatherings. With high ceilings, crystal chandeliers, and a spacious dance floor, this venue offers a sophisticated backdrop for your special occasion.",
  images: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80",
    "https://images.unsplash.com/photo-1515095184717-4f2e1509c564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1562664377-709f2c337eb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1262&q=80",
  ],
  location: "Downtown, 123 Main Street, New York, NY 10001",
  rating: 4.8,
  reviews: 124,
  capacity: "300-500",
  size: "10,000 sq ft",
  hours: "8:00 AM - 12:00 AM",
  featured: true,
  amenities: [
    "Professional sound system",
    "Stage with lighting",
    "Catering kitchen",
    "Coat check",
    "Bridal suite",
    "Tables and chairs included",
    "Wheelchair accessible",
    "Parking available",
    "WiFi",
    "Air conditioning",
    "Projector and screen",
    "Dance floor",
  ],
  pricing: {
    public: {
      weekday: "$1200/day",
      weekend: "$1800/day",
      hourly: "$150/hour",
      setup: "$200",
      cleaning: "$150",
    },
    private: {
      weekday: "$1000/day",
      weekend: "$1500/day",
      hourly: "$125/hour",
      setup: "$150",
      cleaning: "$100",
    },
    corporate: {
      weekday: "$1500/day",
      weekend: "$2200/day",
      hourly: "$200/hour",
      setup: "$250",
      cleaning: "$200",
    },
  },
  availability: {
    monday: "8:00 AM - 10:00 PM",
    tuesday: "8:00 AM - 10:00 PM",
    wednesday: "8:00 AM - 10:00 PM",
    thursday: "8:00 AM - 10:00 PM",
    friday: "8:00 AM - 12:00 AM",
    saturday: "10:00 AM - 12:00 AM",
    sunday: "10:00 AM - 10:00 PM",
  },
  policies: [
    "Cancellation must be made 30 days in advance for a full refund",
    "Security deposit of $500 required",
    "No smoking inside the facility",
    "Outside catering allowed with approval",
    "Alcohol service requires licensed bartender",
    "Music must end by 11:00 PM on weekdays",
  ],
};

const FacilityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [facility, setFacility] = useState<typeof facilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [customerType, setCustomerType] = useState("public");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);

  // Check if the URL has a book=true parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("book") === "true") {
      setBookingOpen(true);
    }
  }, [location]);

  // Fetch facility data (simulated)
  useEffect(() => {
    // In a real app, you would fetch the facility data based on the ID
    // For now, we'll just use our mock data
    setFacility(facilityData);
    setLoading(false);
  }, [id]);

  const handleTabChange = (event: any, newValue: SetStateAction<number>) => {
    setActiveTab(newValue);
  };

  const handleImageClick = (index: SetStateAction<number>) => {
    setActiveImage(index);
  };

  const handleCustomerTypeChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setCustomerType(event.target.value);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleBookingClose = () => {
    setBookingOpen(false);
  };

  const handleBookingSubmit = () => {
    // In a real app, you would submit the booking data to your backend
    if (facility) {
      alert(
        `Booking submitted for ${facility.name} on ${bookingDate?.toDateString()} as ${customerType} customer`
      );
      setBookingOpen(false);
    }
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
          <Typography color="text.primary">{facility.name}</Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          component={Link}
          to="/facilities"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Facilities
        </Button>

        {/* Facility Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                {facility.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOn
                    sx={{ color: "text.secondary", fontSize: 20, mr: 0.5 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {facility.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating
                    value={facility.rating}
                    precision={0.1}
                    size="small"
                    readOnly
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    ({facility.rating}) {facility.reviews} reviews
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  label={`Capacity: ${facility.capacity}`}
                  size="small"
                  icon={<People fontSize="small" />}
                />
                <Chip label={facility.size} size="small" />
                <Chip
                  label={facility.hours}
                  size="small"
                  icon={<AccessTime fontSize="small" />}
                />
                {facility.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    icon={<Star fontSize="small" />}
                  />
                )}
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBookingOpen}
              startIcon={<Event />}
              sx={{ px: 3 }}
            >
              Book Now
            </Button>
          </Box>
        </Box>

        {/* Image Gallery */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={2}
              sx={{
                height: 400,
                backgroundImage: `url(${facility.images[activeImage]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container spacing={1}>
              {facility.images.map((image, index) => (
                <Grid item xs={6} key={index}>
                  <Paper
                    elevation={1}
                    sx={{
                      height: 120,
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 1,
                      cursor: "pointer",
                      border:
                        index === activeImage
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleImageClick(index)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs for Details */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Description" />
              <Tab label="Pricing" />
              <Tab label="Amenities" />
              <Tab label="Availability" />
              <Tab label="Policies" />
            </Tabs>
          </Box>

          {/* Description Tab */}
          <TabPanel value={activeTab} index={0}>
            <Typography variant="body1" paragraph>
              {facility.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              About this space
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <People
                    sx={{ color: "text.secondary", fontSize: 20, mr: 1 }}
                  />
                  <Typography variant="body1">
                    <strong>Capacity:</strong> {facility.capacity} people
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTime
                    sx={{ color: "text.secondary", fontSize: 20, mr: 1 }}
                  />
                  <Typography variant="body1">
                    <strong>Hours:</strong> {facility.hours}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn
                    sx={{ color: "text.secondary", fontSize: 20, mr: 1 }}
                  />
                  <Typography variant="body1">
                    <strong>Size:</strong> {facility.size}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Pricing Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ maxWidth: 300, mb: 2 }}>
                <InputLabel id="customer-type-label">Customer Type</InputLabel>
                <Select
                  labelId="customer-type-label"
                  value={customerType}
                  label="Customer Type"
                  onChange={handleCustomerTypeChange}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {customerType === "public" &&
                  "Standard rates for public events and general bookings."}
                {customerType === "private" &&
                  "Discounted rates for private individuals and small gatherings."}
                {customerType === "corporate" &&
                  "Premium rates for corporate events with additional services."}
              </Typography>
            </Box>

            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "primary.light" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Rate Type
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "white" }}
                    >
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Weekday (Mon-Thu)</TableCell>
                    <TableCell align="right">
                      {facility.pricing[customerType].weekday}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weekend (Fri-Sun)</TableCell>
                    <TableCell align="right">
                      {facility.pricing[customerType].weekend}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hourly Rate</TableCell>
                    <TableCell align="right">
                      {facility.pricing[customerType].hourly}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Setup Fee</TableCell>
                    <TableCell align="right">
                      {facility.pricing[customerType].setup}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cleaning Fee</TableCell>
                    <TableCell align="right">
                      {facility.pricing[customerType].cleaning}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBookingOpen}
                startIcon={<Event />}
              >
                Book Now
              </Button>
            </Box>
          </TabPanel>

          {/* Amenities Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={2}>
              {facility.amenities.map((amenity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={amenity} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Availability Tab */}
          <TabPanel value={activeTab} index={3}>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "primary.light" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Day
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "white" }}
                    >
                      Hours
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(facility.availability).map(([day, hours]) => (
                    <TableRow key={day}>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {day}
                      </TableCell>
                      <TableCell align="right">{hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBookingOpen}
                startIcon={<CalendarMonth />}
              >
                Check Specific Date
              </Button>
            </Box>
          </TabPanel>

          {/* Policies Tab */}
          <TabPanel value={activeTab} index={4}>
            <List>
              {facility.policies.map((policy, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Check color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={policy} />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </Box>

        {/* Booking Dialog */}
        <Dialog
          open={bookingOpen}
          onClose={handleBookingClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Book {facility.name}
            <IconButton
              aria-label="close"
              onClick={handleBookingClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="booking-customer-type-label">
                  Customer Type
                </InputLabel>
                <Select
                  labelId="booking-customer-type-label"
                  value={customerType}
                  label="Customer Type"
                  onChange={handleCustomerTypeChange}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Booking Date"
                  value={bookingDate}
                  onChange={(newValue) => setBookingDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>

              <TextField
                label="Number of Guests"
                type="number"
                fullWidth
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: Number.parseInt(facility.capacity.split("-")[1]),
                  },
                }}
              />

              <TextField label="Event Type" fullWidth select>
                <MenuItem value="wedding">Wedding</MenuItem>
                <MenuItem value="corporate">Corporate Event</MenuItem>
                <MenuItem value="birthday">Birthday Party</MenuItem>
                <MenuItem value="conference">Conference</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>

              <TextField
                label="Special Requests"
                multiline
                rows={4}
                fullWidth
              />

              <Box
                sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Pricing Summary ({customerType})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Base Rate:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {facility.pricing[customerType].weekday}
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
                    {facility.pricing[customerType].setup}
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
                    {facility.pricing[customerType].cleaning}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2">Total:</Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="primary"
                  >
                    {`$${
                      Number.parseInt(
                        facility.pricing[customerType].weekday.replace(
                          /\D/g,
                          ""
                        )
                      ) +
                      Number.parseInt(
                        facility.pricing[customerType].setup.replace(/\D/g, "")
                      ) +
                      Number.parseInt(
                        facility.pricing[customerType].cleaning.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }`}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBookingClose}>Cancel</Button>
            <Button
              onClick={handleBookingSubmit}
              variant="contained"
              color="primary"
              disabled={!bookingDate}
            >
              Book Now
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

// TabPanel component for the tabs
function TabPanel(props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`facility-tabpanel-${index}`}
      aria-labelledby={`facility-tab-${index}`}
      {...other}
      style={{ padding: "24px 0" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default FacilityDetailPage;

import { SetStateAction, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Button,
  CircularProgress,
} from "@mui/material";
import { Search, Sort } from "@mui/icons-material";
import FacilityCard from "../features/client/facilities/components/FacilityCard";
import { Facility, ApiResponse } from "../types/facilityCard";
import { useNavigate } from "react-router-dom";

const FacilitiesPage = () => {
  const navigate = useNavigate();
  // State variables
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(1);

  const facilitiesPerPage = 12;

  // fetch facility data that needed to facility card
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5162/api/Facility/facility-cards"
        );

        const data: ApiResponse = response.data;

        if (data.isSuccess && data.value) {
          setFacilities(data.value);
          setError(null);
        } else {
          setError(data.error || "Failed to fetch facilities");
        }
      } catch (err) {
        console.error("Error fetching facilities:", err);
        if (axios.isAxiosError(err)) {
          setError(`Failed to load facilities: ${err.message}`);
        } else {
          setError("Failed to load facilities. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // handle search input change
  const handleSearchChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
    setPage(1); // reset to first page when searching
  };

  // handle sort change
  const handleSortChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSortBy(event.target.value);
  };

  // handle pagination change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    // scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // navigate to booking page
  const handleViewDetails = (facilityID: number) => {
    navigate(`/booking/${facilityID}`);
  };

  // filter facilities based on search query
  const filteredFacilities = facilities.filter((facility: Facility) => {
    const matchesSearch =
      facility.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // sort facilities
  const sortedFacilities = [...filteredFacilities].sort(
    (a: Facility, b: Facility) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default: // recommended
          return 0;
      }
    }
  );

  // paginate facilities
  const paginatedFacilities = sortedFacilities.slice(
    (page - 1) * facilitiesPerPage,
    page * facilitiesPerPage
  );

  // calculate total pages
  const totalPages = Math.ceil(filteredFacilities.length / facilitiesPerPage);

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Browse Facilities
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Find and book the perfect space for your next event
        </Typography>

        {/* search and filter Bar */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search facilities or locations..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <Sort />
                </InputAdornment>
              }
            >
              <MenuItem key="recommended" value="recommended">
                Recommended
              </MenuItem>
              <MenuItem key="price-low" value="price-low">
                Price: Low to High
              </MenuItem>
              <MenuItem key="price-high" value="price-high">
                Price: High to Low
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Results Summary */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          {loading ? (
            <Typography variant="body1" color="text.secondary">
              Loading facilities...
            </Typography>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Showing {filteredFacilities.length} facilities
            </Typography>
          )}
        </Box>

        {/* Facilities Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        ) : paginatedFacilities.length > 0 ? (
          <Grid container spacing={3}>
            {paginatedFacilities.map((facility) => (
              <Grid item key={facility.facilityID} xs={12} sm={6} md={4}>
                <FacilityCard
                  facility={facility}
                  onViewDetails={() => handleViewDetails(facility.facilityID)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No facilities found matching your criteria.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FacilitiesPage;

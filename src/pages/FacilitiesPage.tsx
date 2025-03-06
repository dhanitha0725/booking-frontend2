import { SetStateAction, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Button,
} from "@mui/material";
import { Search, Sort, Star } from "@mui/icons-material";
import FacilityCard from "../features/facilities/components/FacilityCard";

// Mock data for facilities
const facilitiesData = [
  {
    id: 1,
    name: "Grand Ballroom",
    type: "hall",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80",
    location: "Downtown",
    price: "$1200/day",
    rating: 4.8,
    capacity: "300-500",
    tags: ["Catering", "AV Equipment", "Stage"],
    featured: true,
  },
  {
    id: 2,
    name: "Lakeside Auditorium",
    type: "auditorium",
    image:
      "https://images.unsplash.com/photo-1580212926777-8a7ae4f6df95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    location: "University Campus",
    price: "$800/day",
    rating: 4.6,
    capacity: "200-400",
    tags: ["Theater Seating", "Projector", "Sound System"],
    featured: false,
  },
  {
    id: 3,
    name: "Skyline Hotel Conference Center",
    type: "hotel",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Financial District",
    price: "$1500/day",
    rating: 4.9,
    capacity: "100-300",
    tags: ["Accommodation", "Catering", "Business Center"],
    featured: true,
  },
  {
    id: 4,
    name: "Community Center Hall",
    type: "hall",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    location: "Westside",
    price: "$400/day",
    rating: 4.3,
    capacity: "50-150",
    tags: ["Affordable", "Parking", "Kitchen"],
    featured: false,
  },
  {
    id: 5,
    name: "Tech Hub Meeting Rooms",
    type: "meeting",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    location: "Innovation District",
    price: "$75/hour",
    rating: 4.7,
    capacity: "10-30",
    tags: ["Video Conferencing", "Whiteboard", "High-Speed Internet"],
    featured: false,
  },
  {
    id: 6,
    name: "Riverside Pavilion",
    type: "outdoor",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    location: "Riverfront Park",
    price: "$600/day",
    rating: 4.5,
    capacity: "100-250",
    tags: ["Scenic View", "Outdoor", "Event Tent"],
    featured: true,
  },
  {
    id: 7,
    name: "Historic Theater",
    type: "auditorium",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    location: "Arts District",
    price: "$950/day",
    rating: 4.8,
    capacity: "150-300",
    tags: ["Historic", "Stage", "Lighting"],
    featured: false,
  },
  {
    id: 8,
    name: "Luxury Resort Banquet Hall",
    type: "hotel",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Beachfront",
    price: "$2000/day",
    rating: 4.9,
    capacity: "200-400",
    tags: ["Luxury", "Ocean View", "Full Service"],
    featured: true,
  },
];

const FacilitiesPage = () => {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  const facilitiesPerPage = 6;

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    setPage(1); // Reset to first page when changing category
  };

  // Handle search input change
  const handleSearchChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle sort change
  const handleSortChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSortBy(event.target.value);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter facilities based on category and search query
  const filteredFacilities = facilitiesData.filter((facility) => {
    const matchesCategory = category === "all" || facility.type === category;
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Sort facilities
  const sortedFacilities = [...filteredFacilities].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          Number.parseInt(a.price.replace(/\D/g, "")) -
          Number.parseInt(b.price.replace(/\D/g, ""))
        );
      case "price-high":
        return (
          Number.parseInt(b.price.replace(/\D/g, "")) -
          Number.parseInt(a.price.replace(/\D/g, ""))
        );
      case "rating":
        return b.rating - a.rating;
      case "capacity":
        return (
          Number.parseInt(b.capacity.split("-")[1]) -
          Number.parseInt(a.capacity.split("-")[1])
        );
      default: // recommended
        return b.featured ? 1 : -1;
    }
  });

  // Paginate facilities
  const paginatedFacilities = sortedFacilities.slice(
    (page - 1) * facilitiesPerPage,
    page * facilitiesPerPage
  );

  // Calculate total pages
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

        {/* Search and Filter Bar */}
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
            placeholder="Search facilities, locations, or amenities..."
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
              <MenuItem value="recommended">Recommended</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="capacity">Capacity</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs
            value={category}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="All Facilities" value="all" />
            <Tab label="Auditoriums" value="auditorium" />
            <Tab label="Hotels" value="hotel" />
            <Tab label="Halls" value="hall" />
            <Tab label="Meeting Rooms" value="meeting" />
            <Tab label="Outdoor Venues" value="outdoor" />
          </Tabs>
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
          <Typography variant="body1" color="text.secondary">
            Showing {filteredFacilities.length} facilities
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label="Featured"
              color="primary"
              variant="outlined"
              icon={<Star fontSize="small" />}
            />
          </Box>
        </Box>

        {/* Facilities Grid */}
        {paginatedFacilities.length > 0 ? (
          <Grid container spacing={3}>
            {paginatedFacilities.map((facility) => (
              <Grid item key={facility.id} xs={12} sm={6} md={4}>
                <FacilityCard
                  facility={facility}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(facility.id)}
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
                setCategory("all");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
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

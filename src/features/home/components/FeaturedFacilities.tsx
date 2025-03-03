"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { LocationOn, People } from "@mui/icons-material";

const facilities = [
  {
    id: 1,
    name: "Modern Conference Center",
    image: "/placeholder.svg?height=200&width=300",
    location: "Downtown",
    price: "$75/hour",
    rating: 4.8,
    capacity: "50-200",
    category: "conference",
    tags: ["AV Equipment", "Catering"],
  },
  {
    id: 2,
    name: "Sports Complex",
    image: "/placeholder.svg?height=200&width=300",
    location: "West Side",
    price: "$120/hour",
    rating: 4.6,
    capacity: "20-100",
    category: "sports",
    tags: ["Indoor", "Equipment Provided"],
  },
  {
    id: 3,
    name: "Creative Studio Space",
    image: "/placeholder.svg?height=200&width=300",
    location: "Arts District",
    price: "$45/hour",
    rating: 4.9,
    capacity: "10-30",
    category: "studio",
    tags: ["Natural Light", "Sound System"],
  },
  {
    id: 4,
    name: "Rooftop Event Space",
    image: "/placeholder.svg?height=200&width=300",
    location: "City Center",
    price: "$200/hour",
    rating: 4.7,
    capacity: "50-150",
    category: "event",
    tags: ["Outdoor", "Scenic View"],
  },
];

const FeaturedFacilities = () => {
  const [category, setCategory] = useState("all");

  const handleCategoryChange = (event, newCategory) => {
    setCategory(newCategory);
  };

  const filteredFacilities =
    category === "all"
      ? facilities
      : facilities.filter((facility) => facility.category === category);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Featured Facilities
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Discover our most popular spaces for your next booking
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs
            value={category}
            onChange={handleCategoryChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="All" value="all" />
            <Tab label="Conference" value="conference" />
            <Tab label="Sports" value="sports" />
            <Tab label="Studio" value="studio" />
            <Tab label="Event Spaces" value="event" />
          </Tabs>
        </Box>

        <Grid container spacing={4}>
          {filteredFacilities.map((facility) => (
            <Grid item key={facility.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={facility.image}
                  alt={facility.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {facility.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn
                      sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {facility.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <People
                      sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {facility.capacity} people
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                      ({facility.rating})
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
                  >
                    {facility.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>

                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {facility.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ ml: "auto" }}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="outlined" color="primary" size="large">
            View All Facilities
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedFacilities;

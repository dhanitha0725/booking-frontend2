import { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const facilityTypes = [
  {
    id: 1,
    typeName: "Auditorium",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    typeName: "Bungalow",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    typeName: "Lecture Halls",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    typeName: "Hostels",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    typeName: "Conference Rooms",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  },
];

const FacilityTypesCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
      setScrollPosition(Math.max(0, scrollPosition - 500));
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
      setScrollPosition(scrollPosition + 500);
    }
  };

  return (
    <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
      <Container maxWidth="xl">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 4, fontWeight: 700 }}
        >
          Facilities for Every Occasion
        </Typography>

        <Box sx={{ position: "relative", my: 2 }}>
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: "absolute",
              left: -30,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              width: 50,
              height: 50,
              boxShadow: 2,
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              px: 4,
              py: 6,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "-ms-overflow-style": "none",
              scrollBehavior: "smooth",
            }}
          >
            <Grid
              container
              spacing={4}
              sx={{ flexWrap: "nowrap", minWidth: "min-content" }}
            >
              {facilityTypes.map((type) => (
                <Grid item key={type.id} sx={{ minWidth: 400, maxWidth: 450 }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: 4,
                      borderRadius: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 8,
                      },
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={type.image}
                      alt={type.typeName}
                      sx={{
                        objectFit: "cover",
                        transition: "transform 0.5s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <CardContent
                      sx={{ flexGrow: 1, textAlign: "center", py: 3 }}
                    >
                      <Typography
                        gutterBottom
                        variant="h4"
                        component="h3"
                        fontWeight="bold"
                      >
                        {type.typeName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <IconButton
            onClick={scrollRight}
            sx={{
              position: "absolute",
              right: -30,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              width: 50,
              height: 50,
              boxShadow: 2,
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default FacilityTypesCarousel;

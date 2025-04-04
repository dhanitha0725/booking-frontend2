import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  LocationOn,
  ChevronLeft,
  ChevronRight,
  Check,
} from "@mui/icons-material";
import { Facility } from "../../../../types/facilityDetails";

const FacilityDetails = ({ facility }: { facility: Facility }) => {
  const [activeImage, setActiveImage] = useState(0);

  const handlePrevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? facility.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImage((prev) =>
      prev === facility.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Facility Details
      </Typography>

      <Grid container spacing={3}>
        {/* Image Carousel - Full Width */}
        <Grid item xs={12}>
          <Box sx={{ position: "relative", height: 400 }}>
            <Paper
              elevation={2}
              sx={{
                height: "100%",
                backgroundImage: `url(${facility.images[activeImage]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
              }}
            />

            {/* Navigation Arrows */}
            <IconButton
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
              onClick={handlePrevImage}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
              onClick={handleNextImage}
            >
              <ChevronRight />
            </IconButton>

            {/* Image Indicators */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {facility.images.map((_: string, index: number) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      index === activeImage
                        ? "primary.main"
                        : "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Facility Info - Full Width Below Carousel */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn
                  sx={{ color: "text.secondary", fontSize: 20, mr: 0.5 }}
                />
                <Typography variant="body1" color="text.secondary">
                  {facility.location}
                </Typography>
              </Box>

              {/* Amenities List */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Amenities:
              </Typography>
              <List dense disablePadding sx={{ mb: 2 }}>
                {facility.amenities.map((amenity: string, index: number) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Check fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={amenity} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Typography variant="body1" paragraph>
              {facility.description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacilityDetails;

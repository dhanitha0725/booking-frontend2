import {
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  LocationOn,
  CheckCircleOutline,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Facility } from "../../../../types/facilityDetails";

// receive facility object
interface FacilityDetailsProps {
  facility: Facility;
}

const FacilityDetails = ({ facility }: FacilityDetailsProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();

  // Auto-play functionality with 5s interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning && facility.images.length > 1) {
        handleNext();
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [activeStep, isTransitioning]);

  // Carousel control handlers
  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveStep((prevActiveStep) =>
      prevActiveStep === facility.images.length - 1 ? 0 : prevActiveStep + 1
    );

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleBack = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveStep((prevActiveStep) =>
      prevActiveStep === 0 ? facility.images.length - 1 : prevActiveStep - 1
    );

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Rendering logic only
  if (!facility) {
    return <Alert severity="info">No facility information available</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {facility.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {facility.images.length > 0 ? (
            <Box
              sx={{
                position: "relative",
                height: 400,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "black",
              }}
            >
              {/* Image Carousel */}
              {facility.images.map((image, index) => (
                <Box
                  key={`image-${index}`}
                  component="img"
                  src={image}
                  alt={`${facility.name} - image ${index + 1}`}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    opacity: index === activeStep ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                    zIndex: index === activeStep ? 1 : 0,
                  }}
                  onError={(e) => {
                    // Handle image load error
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x400?text=Image+Not+Available";
                    e.currentTarget.alt = "Image not available";
                  }}
                />
              ))}

              {/* Navigation Arrows */}
              <IconButton
                onClick={handleBack}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <ArrowBackIos />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <ArrowForwardIos />
              </IconButton>

              {/* Image Indicators */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  zIndex: 2,
                }}
              >
                {facility.images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        index === activeStep
                          ? theme.palette.primary.main
                          : "rgba(255, 255, 255, 0.7)",
                      border: "2px solid white",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      boxShadow: "0px 1px 3px rgba(0,0,0,0.3)",
                    }}
                    onClick={() => {
                      if (!isTransitioning) {
                        setActiveStep(index);
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Paper
              elevation={2}
              sx={{
                height: 400,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>No Image Available</Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocationOn color="action" />
            <Typography variant="body1" color="text.secondary">
              {facility.location}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {facility.description}
          </Typography>

          <Typography variant="h6" color="text.primary" gutterBottom>
            Amenities:
          </Typography>

          <List dense>
            {facility.amenities.map((amenity) => (
              <ListItem
                key={`amenity-${amenity.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <ListItemIcon>
                  <CheckCircleOutline color="success" />
                </ListItemIcon>
                <ListItemText primary={amenity} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacilityDetails;

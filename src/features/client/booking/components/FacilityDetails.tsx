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
import { useState } from "react";
import { Facility } from "../../../../types/facilityDetails";

// receive facility object
interface FacilityDetailsProps {
  facility: Facility;
}

const FacilityDetails = ({ facility }: FacilityDetailsProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  // Carousel control handlers
  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === facility.images.length - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === 0 ? facility.images.length - 1 : prevActiveStep - 1
    );
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
              }}
            >
              {/* Image Carousel */}
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  backgroundImage: `url(${facility.images[activeStep]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "background-image 0.5s ease-in-out",
                }}
              />

              {/* Navigation Arrows */}
              <IconButton
                onClick={handleBack}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
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
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
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
                  zIndex: 1,
                }}
              >
                {facility.images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor:
                        index === activeStep
                          ? theme.palette.primary.main
                          : "rgba(255, 255, 255, 0.7)",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveStep(index)}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Paper
              elevation={2}
              sx={{
                height: "100%",
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

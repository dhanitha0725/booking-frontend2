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
} from "@mui/material";
import { LocationOn, CheckCircleOutline } from "@mui/icons-material";
import { Facility } from "../../../../types/facilityDetails";

// receive facility object
interface FacilityDetailsProps {
  facility: Facility;
}

const FacilityDetails = ({ facility }: FacilityDetailsProps) => {
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
          <Box sx={{ position: "relative", height: 400 }}>
            {facility.images.length > 0 ? (
              <Paper
                elevation={2}
                sx={{
                  height: "100%",
                  backgroundImage: `url(${facility.images[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                }}
              />
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
          </Box>
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

import { Typography, Grid, Box } from "@mui/material";
import { People, AccessTime, LocationOn } from "@mui/icons-material";
import { Facility } from "../../../types/facilityDetails";

interface DescriptionTabProps {
  facility: Facility;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({ facility }) => {
  return (
    <>
      <Typography variant="body1" paragraph>
        {facility.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        About this space
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <People sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
            <Typography variant="body1">
              <strong>Capacity:</strong> {facility.capacity} people
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTime sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
            <Typography variant="body1">
              <strong>Hours:</strong> {facility.hours}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOn sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
            <Typography variant="body1">
              <strong>Size:</strong> {facility.size}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default DescriptionTab;

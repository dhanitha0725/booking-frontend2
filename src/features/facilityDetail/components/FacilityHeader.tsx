import { Box, Typography, Chip, Button, Rating } from "@mui/material";
import {
  LocationOn,
  People,
  AccessTime,
  Star,
  Event,
} from "@mui/icons-material";
import { Facility } from "../../../types/facilityDetails";

interface FacilityHeaderProps {
  facility: Facility;
  onBookNow: () => void;
}

const FacilityHeader: React.FC<FacilityHeaderProps> = ({
  facility,
  onBookNow,
}) => {
  return (
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
          onClick={onBookNow}
          startIcon={<Event />}
          sx={{ px: 3 }}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );
};

export default FacilityHeader;

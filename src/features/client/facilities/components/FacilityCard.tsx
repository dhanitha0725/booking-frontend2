import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { LocationOn, ImageNotSupported } from "@mui/icons-material";
import { Facility } from "../../../../types/facilityCard";
import { useState } from "react";

// handle price values
const formatPrice = (price: number): string => {
  if (price === 0) {
    return "Contact for pricing";
  }
  return `Rs.${price.toLocaleString()}`;
};

// Fallback component for when images fail to load
const ImageFallback = () => (
  <Box
    sx={{
      height: "200px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.04)",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <ImageNotSupported sx={{ fontSize: 40, color: "text.disabled" }} />
    <Typography variant="caption" color="text.disabled">
      No Image Available
    </Typography>
  </Box>
);

interface FacilityCardProps {
  facility: Facility;
  onViewDetails: (facilityId: number) => void;
}

const FacilityCard = ({ facility, onViewDetails }: FacilityCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {facility.imageUrl && !imageError ? (
        <CardMedia
          component="img"
          height="200"
          image={facility.imageUrl}
          alt={facility.facilityName}
          sx={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
      ) : (
        <ImageFallback />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold" }}
        >
          {facility.facilityName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {facility.location}
          </Typography>
        </Box>

        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
          {formatPrice(facility.price)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={
            () =>
              onViewDetails(
                facility.facilityId
              ) /* Updated to use facilityID instead of facilityId */
          }
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default FacilityCard;

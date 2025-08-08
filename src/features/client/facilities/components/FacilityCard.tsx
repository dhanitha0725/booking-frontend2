import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Paper,
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
      height: "224px", // Matching the 'h-56' from Tailwind (56 * 4px = 224px)
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
        borderRadius: "8px",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Card Header */}
      <Paper elevation={0} sx={{ position: "relative", height: "224px" }}>
        {facility.imageUrl && !imageError ? (
          <CardMedia
            component="img"
            height="224"
            image={facility.imageUrl}
            alt={facility.facilityName}
            sx={{ objectFit: "cover" }}
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageFallback />
        )}
      </Paper>

      {/* Card Body */}
      <CardContent sx={{ flexGrow: 1, px: 3, py: 2 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: "#1e293b", // blue-gray color
          }}
        >
          {facility.facilityName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <LocationOn sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {facility.location}
          </Typography>
        </Box>

        {/* Highlighted price with larger, bold font */}
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1e293b",
            letterSpacing: "0.01em",
          }}
        >
          {formatPrice(facility.price)}
        </Typography>
      </CardContent>

      {/* Card Footer */}
      <CardActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={() => onViewDetails(facility.facilityID)}
          sx={{
            textTransform: "none",
            backgroundColor: "#000000",
            color: "#ffffff",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            borderRadius: "6px",
            fontWeight: 500,
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#333333",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default FacilityCard;

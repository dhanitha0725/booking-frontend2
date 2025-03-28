import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { Facility } from "../../../../types/facilityCard";

// handle null images
const DEFAULT_IMAGE =
  "https://via.placeholder.com/400x200?text=No+Image+Available";

// handle price values
const formatPrice = (price: number): string => {
  if (price === 0) {
    return "Contact for pricing";
  }
  return `Rs.${price.toLocaleString()}`;
};

interface FacilityCardProps {
  facility: Facility;
  onViewDetails: () => void;
}

const FacilityCard = ({ facility, onViewDetails }: FacilityCardProps) => {
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
      <CardMedia
        component="img"
        height="200"
        image={facility.imageUrl || DEFAULT_IMAGE}
        alt={facility.facilityName}
        sx={{ objectFit: "cover" }}
      />
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
        <Button size="small" color="primary" onClick={onViewDetails}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default FacilityCard;

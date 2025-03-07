import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  IconButton,
  Stack,
} from "@mui/material";
import {
  LocationOn,
  People,
  Favorite,
  FavoriteBorder,
  Star,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

// Define prop types for the component
const FacilityCard = ({ facility, onToggleFavorite, isFavorite }) => {
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
      {facility.featured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          icon={<Star fontSize="small" />}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
          }}
        />
      )}
      <IconButton
        onClick={() => onToggleFavorite(facility.id)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          bgcolor: "rgba(255,255,255,0.8)",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.9)",
          },
        }}
      >
        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>
      <CardMedia
        component="img"
        height="200"
        image={facility.image}
        alt={facility.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold" }}
        >
          {facility.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {facility.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <People sx={{ color: "text.secondary", fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {facility.capacity} people
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Rating
            value={facility.rating}
            precision={0.1}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({facility.rating})
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
        >
          {facility.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Stack>

        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
          {facility.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/facilities/${facility.id}`}
        >
          View Details
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{ ml: "auto" }}
          component={Link}
          to={`/facilities/${facility.id}?book=true`}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default FacilityCard;

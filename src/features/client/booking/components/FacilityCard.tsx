import { Paper, Typography, Box } from "@mui/material";

interface FacilityCardProps {
  facility: {
    facilityName: string;
    location: string;
    images: string[];
    duration: string;
  };
}

const FacilityCard = ({ facility }: FacilityCardProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box
        sx={{
          heigh: 150,
          backgroundImage: `url($(facility.images[0]))`,
          backgroundSize: "cover",
        }}
      ></Box>
      <Box>
        {" "}
        <Typography variant="h6" gutterBottom>
          {facility.facilityName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Location:</strong> {facility.location}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Duration:</strong> {facility.duration}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FacilityCard;

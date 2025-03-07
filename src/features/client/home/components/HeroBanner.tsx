import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const HeroBanner = () => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        pt: 8,
        pb: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Book Facilities with Ease
            </Typography>
            <Typography
              variant="h5"
              color="inherit"
              paragraph
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Find and book the perfect space for your events, meetings, and
              activities. Simple, fast, and reliable.
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<SearchIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                boxShadow: "0 8px 16px rgba(245, 0, 87, 0.24)",
              }}
            >
              Find Facilities
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                height: { xs: 300, md: 400 },
                backgroundImage: "url(/placeholder.svg?height=400&width=600)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 4,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default HeroBanner;

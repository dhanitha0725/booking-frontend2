import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

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
        <Grid
          container
          spacing={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Grid item xs={12} md={8}>
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
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                size="large"
                color="secondary"
                component={RouterLink}
                to="/facilities"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 16px rgba(10, 16, 85, 0.24)",
                }}
              >
                See all Facilities
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroBanner;

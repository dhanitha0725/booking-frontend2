import { Box, Button, Container, Typography, Paper } from "@mui/material";

const CallToAction = () => {
  return (
    <Box sx={{ py: 8, bgcolor: "primary.main", color: "white" }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            bgcolor: "primary.dark",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ color: "white" }}
          >
            Ready to Book Your Facility?
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{ mb: 4, maxWidth: 600, mx: "auto", color: "white" }}
          >
            Join thousands of satisfied users who have found and booked the
            perfect facility for their needs.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 8px 16px rgba(245, 0, 87, 0.24)",
              mr: 2,
              mb: { xs: 2, sm: 0 },
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Learn More
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CallToAction;

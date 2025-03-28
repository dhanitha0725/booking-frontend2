import { Box, Container, Typography, Grid, Paper, Avatar } from "@mui/material";
import {
  Search,
  EventAvailable,
  Payment,
  CheckCircle,
} from "@mui/icons-material";

const steps = [
  {
    title: "Search",
    description:
      "Browse through our wide selection of facilities and find the perfect space for your needs.",
    icon: <Search />,
    color: "#1976d2",
  },
  {
    title: "Select Date & Time",
    description:
      "Choose your preferred date and time slot from the available options.",
    icon: <EventAvailable />,
    color: "#2196f3",
  },
  {
    title: "Book & Pay",
    description:
      "Complete your booking by making a secure payment through our platform.",
    icon: <Payment />,
    color: "#03a9f4",
  },
  {
    title: "Confirm & Enjoy",
    description: "Receive instant confirmation and enjoy your booked facility!",
    icon: <CheckCircle />,
    color: "#00bcd4",
  },
];

const HowItWorks = () => {
  return (
    <Box id="how-it-works" sx={{ py: 8, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          How It Works
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 8 }}
        >
          Book your desired facility in just a few simple steps
        </Typography>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    backgroundColor: step.color,
                  },
                }}
              >
                <Avatar
                  sx={{
                    mb: 2,
                    bgcolor: step.color,
                    width: 60,
                    height: 60,
                  }}
                >
                  {step.icon}
                </Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>

                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: "30%",
                      right: -30,
                      width: 60,
                      height: 2,
                      bgcolor: "divider",
                      zIndex: 1,
                    }}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;

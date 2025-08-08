import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  MobileStepper,
  Fade,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Import local images
import conferenceRoom1 from "../../../../assets/images/conference-room-with-large-screen-that-says-conference.jpg";
import auditorium from "../../../../assets/images/empty-auditorium-awaiting-big-performance-ahead-generated-by-ai.jpg";
import modernHouse from "../../../../assets/images/Modern House at Dusk.png";

const carouselItems = [
  {
    image: auditorium,
    title: "Modern Auditorium Facilities",
    description:
      "Host your conferences, seminars, and large events in our spacious and well-equipped auditoriums with state-of-the-art sound systems and comfortable seating.",
    buttonText: "Explore Auditoriums",
    path: "/facilities?type=auditorium",
  },
  {
    image: modernHouse,
    title: "Luxury Bungalows",
    description:
      "Experience comfort and privacy in our well-maintained bungalows, perfect for retreats, family stays, or executive accommodations with all modern amenities.",
    buttonText: "View Bungalows",
    path: "/facilities?type=bungalow",
  },
  {
    image: conferenceRoom1,
    title: "Professional Conference Rooms",
    description:
      "Conduct meetings, training sessions, and workshops in our fully-equipped conference rooms with modern presentation technology and flexible seating arrangements.",
    buttonText: "Book Conference Rooms",
    path: "/facilities?type=conference",
  },
];

const FeaturedFacilities = () => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselItems.length;
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [autoPlay, maxSteps]);

  const handleNext = () => {
    setAutoPlay(false); // Pause autoplay when user interacts
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setAutoPlay(false); // Pause autoplay when user interacts
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        m: 0,
        p: 0,
        // Remove top margin completely
        mt: 0,
      }}
    >
      {carouselItems.map((item, index) => (
        <Fade
          key={index}
          in={index === activeStep}
          timeout={800}
          style={{
            display: index === activeStep ? "block" : "none",
            height: "100%",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center", // Center all content horizontally
                textAlign: "center", // Center all text
                bgcolor: "rgba(0,0,0,0.5)",
                p: 4,
              }}
            >
              <Container maxWidth="lg">
                <Box
                  sx={{
                    maxWidth: { xs: "100%", md: "70%" },
                    mx: "auto", // Center the content box
                    pt: { xs: "64px", sm: "72px" }, // Add padding-top to account for header height
                  }}
                >
                  <Typography
                    variant="h2"
                    color="white"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      fontSize: {
                        xs: "2rem",
                        sm: "3rem",
                        md: "4rem",
                      },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="white"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      fontSize: { xs: "1.1rem", md: "1.5rem" },
                      maxWidth: "800px",
                      mx: "auto", // Center the description
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "center", // Center the button
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to="/facilities"
                      sx={{
                        px: 6,
                        py: 1.5,
                        fontWeight: 500,
                        fontSize: "1rem",
                        textTransform: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#ffffff", // White background
                        color: "#000000", // Black text for contrast
                        "&:hover": {
                          backgroundColor: "#f5f5f5", // Slightly darker white on hover
                          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      View Facilities
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        </Fade>
      ))}

      <IconButton
        onClick={handleBack}
        sx={{
          position: "absolute",
          left: { xs: 8, md: 24 },
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(255, 255, 255, 0.3)",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.5)" },
          zIndex: 2,
          color: "white",
          width: { xs: 40, md: 56 },
          height: { xs: 40, md: 56 },
        }}
      >
        <KeyboardArrowLeft sx={{ fontSize: { xs: 24, md: 32 } }} />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: { xs: 8, md: 24 },
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(255, 255, 255, 0.3)",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.5)" },
          zIndex: 2,
          color: "white",
          width: { xs: 40, md: 56 },
          height: { xs: 40, md: 56 },
        }}
      >
        <KeyboardArrowRight sx={{ fontSize: { xs: 24, md: 32 } }} />
      </IconButton>

      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          bgcolor: "transparent",
          position: "absolute",
          bottom: 16,
          width: "100%",
          justifyContent: "center",
        }}
        nextButton={<Box />}
        backButton={<Box />}
      />
    </Box>
  );
};

export default FeaturedFacilities;

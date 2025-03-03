"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  useTheme,
  useMediaQuery,
  MobileStepper,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FormatQuote,
} from "@mui/icons-material";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Planner",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    text: "FacilityBook made it incredibly easy to find and book the perfect venue for our corporate event. The booking process was seamless, and the space exceeded our expectations!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Sports Coach",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4,
    text: "I regularly book practice spaces for my team, and this platform has simplified the entire process. Great selection of facilities and excellent customer service.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Yoga Instructor",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    text: "As someone who needs to book studio space frequently, I can't recommend FacilityBook enough. It's reliable, user-friendly, and has saved me countless hours.",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Conference Organizer",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    text: "The variety of conference spaces available is impressive. I was able to find exactly what I needed for our annual meeting, and the booking confirmation was instant.",
  },
];

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = isMobile
    ? testimonials.length
    : Math.ceil(testimonials.length / 2);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          What Our Users Say
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Don't just take our word for it - hear from our satisfied users
        </Typography>

        <Box sx={{ position: "relative" }}>
          {/* Custom slider implementation instead of SwipeableViews */}
          <Box sx={{ overflow: "hidden" }}>
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.3s ease",
                transform: `translateX(-${activeStep * 100}%)`,
              }}
            >
              {isMobile
                ? // Mobile view - one testimonial per slide
                  testimonials.map((testimonial) => (
                    <Box
                      key={testimonial.id}
                      sx={{
                        p: 1,
                        minWidth: "100%",
                        flexShrink: 0,
                      }}
                    >
                      <Card elevation={2} sx={{ height: "100%" }}>
                        <CardContent>
                          <Box sx={{ position: "relative", mb: 2 }}>
                            <FormatQuote
                              sx={{
                                position: "absolute",
                                top: -10,
                                left: -10,
                                color: "primary.light",
                                opacity: 0.3,
                                fontSize: 40,
                              }}
                            />
                            <Typography variant="body1" paragraph>
                              "{testimonial.text}"
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              sx={{ mr: 2 }}
                            />
                            <Box>
                              <Typography variant="subtitle1" component="div">
                                {testimonial.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {testimonial.role}
                              </Typography>
                              <Rating
                                value={testimonial.rating}
                                size="small"
                                readOnly
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))
                : // Desktop view - two testimonials per slide
                  Array.from({
                    length: Math.ceil(testimonials.length / 2),
                  }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        p: 1,
                        minWidth: "100%",
                        flexShrink: 0,
                      }}
                    >
                      {testimonials
                        .slice(index * 2, index * 2 + 2)
                        .map((testimonial) => (
                          <Box key={testimonial.id} sx={{ flex: 1, p: 1 }}>
                            <Card elevation={2} sx={{ height: "100%" }}>
                              <CardContent>
                                <Box sx={{ position: "relative", mb: 2 }}>
                                  <FormatQuote
                                    sx={{
                                      position: "absolute",
                                      top: -10,
                                      left: -10,
                                      color: "primary.light",
                                      opacity: 0.3,
                                      fontSize: 40,
                                    }}
                                  />
                                  <Typography variant="body1" paragraph>
                                    "{testimonial.text}"
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    sx={{ mr: 2 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      component="div"
                                    >
                                      {testimonial.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {testimonial.role}
                                    </Typography>
                                    <Rating
                                      value={testimonial.rating}
                                      size="small"
                                      readOnly
                                    />
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Box>
                        ))}
                    </Box>
                  ))}
            </Box>
          </Box>

          <IconButton
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: -16, md: -28 },
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: -16, md: -28 },
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>

        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            maxWidth: 400,
            flexGrow: 1,
            mx: "auto",
            mt: 4,
            bgcolor: "transparent",
          }}
          nextButton={<Box />}
          backButton={<Box />}
        />
      </Container>
    </Box>
  );
};

export default Testimonials;

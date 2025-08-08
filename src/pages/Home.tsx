import FeaturedFacilities from "../features/client/home/components/FeaturedFacilities";
import HowItWorks from "../features/client/home/components/HowItWorks";
import CallToAction from "../features/client/home/components/CallToAction";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        m: 0,
        p: 0,
        overflowX: "hidden",
      }}
    >
      <FeaturedFacilities />
      <Box id="content" sx={{ mt: 0, pt: 0 }}>
        <HowItWorks />
        <CallToAction />
      </Box>
    </Box>
  );
};

export default Home;

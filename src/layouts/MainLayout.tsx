import { Box } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;

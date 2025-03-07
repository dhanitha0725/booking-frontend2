import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";

const BackButton: React.FC = () => {
  return (
    <Button
      component={Link}
      to="/facilities"
      startIcon={<ArrowBack />}
      sx={{ mb: 2 }}
    >
      Back to Facilities
    </Button>
  );
};

export default BackButton;

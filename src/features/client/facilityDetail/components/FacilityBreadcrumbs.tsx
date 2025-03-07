import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NavigateNext from "@mui/icons-material/NavigateNext";

interface FacilityBreadcrumbsProps {
  facilityName: string;
}

const FacilityBreadcrumbs: React.FC<FacilityBreadcrumbsProps> = ({
  facilityName,
}) => {
  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        Home
      </Link>
      <Link
        to="/facilities"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        Facilities
      </Link>
      <Typography color="text.primary">{facilityName}</Typography>
    </Breadcrumbs>
  );
};

export default FacilityBreadcrumbs;

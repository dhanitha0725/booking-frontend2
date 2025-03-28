import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";

interface PackageSelectionProps {
  packages: any[];
  customerType: string;
  selectedPackages: string[] | number[];
  onPackageSelect: (packageId: string | number, selected: boolean) => void;
  duration: number;
}

const PackageSelection = ({
  packages,
  customerType,
  selectedPackages,
  onPackageSelect,
  duration,
}: PackageSelectionProps) => {
  const handleCheckboxChange = (event, packageId) => {
    onPackageSelect(packageId, event.target.checked);
  };

  // Calculate total price based on duration
  const calculatePrice = (basePrice) => {
    return basePrice * (duration || 1);
  };

  return (
    <Box>
      {packages.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No packages available for this facility.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.light" }}>
                <TableCell
                  padding="checkbox"
                  sx={{ color: "white" }}
                ></TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Package Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Includes
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Price ({customerType})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow
                  key={pkg.id}
                  hover
                  selected={selectedPackages.includes(pkg.id)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.50",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPackages.includes(pkg.id)}
                      onChange={(e) => handleCheckboxChange(e, pkg.id)}
                      inputProps={{ "aria-labelledby": `package-${pkg.id}` }}
                    />
                  </TableCell>
                  <TableCell id={`package-${pkg.id}`}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {pkg.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{pkg.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {pkg.includes.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        ${calculatePrice(pkg.pricing[customerType])}
                      </Typography>
                      <Tooltip title="Price is for the entire duration">
                        <IconButton size="small">
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      ${pkg.pricing[customerType]} per day
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PackageSelection;

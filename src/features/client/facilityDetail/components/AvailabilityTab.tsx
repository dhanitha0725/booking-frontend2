import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

interface AvailabilityTabProps {
  availability: Record<string, string>;
  onBookNow: () => void;
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({
  availability,
  onBookNow,
}) => {
  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Day
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Hours
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(availability).map(([day, hours]) => (
              <TableRow key={day}>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {day}
                </TableCell>
                <TableCell align="right">{hours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onBookNow}
          startIcon={<CalendarMonth />}
        >
          Check Specific Date
        </Button>
      </Box>
    </>
  );
};

export default AvailabilityTab;

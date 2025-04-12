import { Box, Typography } from "@mui/material";

type TotalSummaryProps = {
  total: number;
};

const TotalSummary = ({ total }: TotalSummaryProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography variant="h6">Total Price:</Typography>
    <Typography variant="h6">Rs. {total.toFixed(2)}</Typography>
  </Box>
);

export default TotalSummary;

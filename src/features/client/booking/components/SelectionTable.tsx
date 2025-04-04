import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { SelectionItem } from "../../../../types/SelectionItem";

interface SelectionTableProps {
  items: SelectionItem[];
  duration: number;
  customerType: string;
  dateRange: [Date, Date]; // Define the type for dateRange later
  onSelectionChange: (itemId: string | number, selected: boolean) => void; // itemId will be facilityName for now
}

const SelectionTable: React.FC<SelectionTableProps> = ({
  items,
  duration,
  customerType,
  onSelectionChange, // For future use
}) => {
  if (items.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No items available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Facility Name</TableCell>
            <TableCell>Default Duration (hours)</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.facilityName}>
              <TableCell>{item.facilityName}</TableCell>
              <TableCell>{item.defaultDuration}</TableCell>
              <TableCell>
                {/* Calculate price here */}
                {calculatePrice(item, duration, customerType)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function calculatePrice(
  item: SelectionItem,
  duration: number,
  customerType: string
): number | string {
  const pricing = item.pricing[customerType];
  if (pricing.perDay && duration % 24 === 0) {
    return pricing.perDay * (duration / 24);
  } else if (pricing.perHour) {
    return pricing.perHour * duration;
  } else {
    return "Pricing not available for this duration";
  }
}

export default SelectionTable;

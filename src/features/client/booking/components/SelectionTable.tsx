import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Checkbox,
  TextField,
} from "@mui/material";
import {
  PackagesDto,
  RoomDto,
  BookingItemDto,
} from "../../../../types/selectedFacility";

interface SelectionTableProps {
  packages: PackagesDto[];
  rooms: RoomDto[];
  onSelectionChange: (
    type: "package" | "room",
    id: number,
    quantity: number
  ) => void;
  requiresDates: boolean;
  selectedItems: BookingItemDto[];
}

const SelectionTable = ({
  packages,
  rooms,
  onSelectionChange,
  requiresDates,
  selectedItems,
}: SelectionTableProps) => {
  const hasPackages = packages.length > 0;
  const hasRooms = rooms.length > 0;

  // Check if a package is selected
  const isPackageSelected = (packageId: number) => {
    return selectedItems.some(
      (item) => item.type === "package" && item.itemId === packageId
    );
  };

  const handlePackageSelection = (packageId: number, isSelected: boolean) => {
    onSelectionChange("package", packageId, isSelected ? 1 : 0);
  };

  // Get room quantity from selected items
  const getRoomQuantity = (roomId: number) => {
    const item = selectedItems.find(
      (item) => item.type === "room" && item.itemId === roomId
    );
    return item ? item.quantity : 0;
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      {hasPackages && (
        <>
          <Typography variant="h6" sx={{ p: 2 }}>
            Available Packages
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Public Price</TableCell>
                <TableCell>Corporate Price</TableCell>
                <TableCell>Private Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.packageId}>
                  <TableCell>
                    <Checkbox
                      checked={isPackageSelected(pkg.packageId)}
                      onChange={(e) =>
                        handlePackageSelection(pkg.packageId, e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{pkg.packageName}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  {["public", "corporate", "private"].map((sector) => (
                    <TableCell key={sector}>
                      Rs.{" "}
                      {pkg.pricing.find((price) => price.sector === sector)
                        ?.price || "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {hasRooms && (
        <>
          <Typography variant="h6" sx={{ p: 2 }}>
            Available Rooms
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Type</TableCell>
                <TableCell>Public Price</TableCell>
                <TableCell>Corporate Price</TableCell>
                <TableCell>Private Price</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.roomId}>
                  <TableCell>{room.roomType}</TableCell>
                  {["public", "corporate", "private"].map((sector) => (
                    <TableCell key={sector}>
                      Rs.{" "}
                      {room.pricing.find((price) => price.sector === sector)
                        ?.price || "N/A"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      value={getRoomQuantity(room.roomId)}
                      onChange={(e) =>
                        onSelectionChange(
                          "room",
                          room.roomId,
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {!hasPackages && !hasRooms && (
        <Typography variant="h6" sx={{ p: 2, color: "red" }}>
          Currently this facility can not be booked. Please check back later.
        </Typography>
      )}

      {requiresDates && (
        <Alert severity="info" sx={{ m: 2 }}>
          Date selection is required for rooms and daily packages
        </Alert>
      )}
    </TableContainer>
  );
};

export default SelectionTable;

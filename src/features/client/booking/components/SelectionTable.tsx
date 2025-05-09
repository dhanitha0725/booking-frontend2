import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  TextField,
  Box,
  Divider,
  Paper,
  Alert,
} from "@mui/material";
import {
  PackagesDto,
  RoomDto,
  BookingItemDto,
} from "../../../../types/selectedFacility";
import dayjs from "dayjs";

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
  isAvailable: boolean;
  availabilityMessage?: string;
  dateRange: { startDate: dayjs.Dayjs | null; endDate: dayjs.Dayjs | null };
}

const SelectionTable = ({
  packages,
  rooms,
  onSelectionChange,
  selectedItems,
  isAvailable,
  availabilityMessage,
  dateRange,
}: SelectionTableProps) => {
  const hasPackages = packages.length > 0;
  const hasRooms = rooms.length > 0;

  // Check if any package is selected
  const hasSelectedPackage = selectedItems.some(
    (item) => item.type === "package" && item.quantity > 0
  );

  // Check if any room is selected
  const hasSelectedRoom = selectedItems.some(
    (item) => item.type === "room" && item.quantity > 0
  );

  // Check if a package is selected
  const isPackageSelected = (packageId: number) => {
    return selectedItems.some(
      (item) => item.type === "package" && item.itemId === packageId
    );
  };

  // Handle package selection (quantity is always 1 or 0)
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

  // Check if a specific package requires dates
  const checkIfPackageRequiresDates = (packageId: number) => {
    return (
      packages.find((pkg) => pkg.packageId === packageId)?.requiresDates ||
      false
    );
  };

  // Check if dates are missing
  const areDatesMissing = !dateRange.startDate || !dateRange.endDate;

  // Determine if we should show unavailability message for an item
  const getAvailabilityMessage = (
    isItemSelected: boolean,
    itemType: string,
    itemId: number
  ) => {
    if (!isItemSelected) return null;

    if (!isAvailable) {
      // If the API returned a specific message, use it
      if (availabilityMessage) {
        return availabilityMessage;
      }

      // For rooms, always show date selection message if dates are missing
      if (itemType === "room" && areDatesMissing) {
        return "Please select both start and end dates";
      }

      // For packages, check if this specific package requires dates
      if (itemType === "package") {
        const packageRequiresDates = checkIfPackageRequiresDates(itemId);
        if (packageRequiresDates && areDatesMissing) {
          return "Please select both start and end dates";
        }
      }

      // Default unavailability message
      return "Currently unavailable";
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%" }}>
      {hasPackages && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Packages
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              opacity: hasSelectedRoom ? 0.6 : 1,
              pointerEvents: hasSelectedRoom ? "none" : "auto",
            }}
          >
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
                {packages.map((pkg) => {
                  const isPkgSelected = isPackageSelected(pkg.packageId);
                  const itemMessage = getAvailabilityMessage(
                    isPkgSelected,
                    "package",
                    pkg.packageId
                  );
                  const isUnavailable = isPkgSelected && !isAvailable;

                  return (
                    <TableRow
                      key={pkg.packageId}
                      sx={
                        isUnavailable
                          ? { backgroundColor: "rgba(211, 47, 47, 0.04)" }
                          : {}
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={isPkgSelected}
                          onChange={(e) =>
                            handlePackageSelection(
                              pkg.packageId,
                              e.target.checked
                            )
                          }
                          disabled={hasSelectedRoom}
                        />
                      </TableCell>
                      <TableCell>
                        {pkg.packageName}
                        {itemMessage && (
                          <Typography
                            variant="caption"
                            color="error"
                            display="block"
                          >
                            {itemMessage}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{pkg.duration}</TableCell>
                      {["public", "corporate", "private"].map((sector) => (
                        <TableCell key={sector}>
                          Rs.{" "}
                          {pkg.pricing.find((price) => price.sector === sector)
                            ?.price || "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {hasSelectedRoom && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Please deselect all rooms to select packages
            </Alert>
          )}
        </>
      )}

      {hasPackages && hasRooms && <Divider sx={{ my: 3 }} />}

      {hasRooms && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Available Rooms
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              opacity: hasSelectedPackage ? 0.6 : 1,
              pointerEvents: hasSelectedPackage ? "none" : "auto",
            }}
          >
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
                {rooms.map((room) => {
                  const roomQty = getRoomQuantity(room.roomTypeId);
                  const isRoomSelected = roomQty > 0;
                  const itemMessage = getAvailabilityMessage(
                    isRoomSelected,
                    "room",
                    room.roomTypeId
                  );

                  return (
                    <TableRow
                      key={room.roomTypeId}
                      sx={
                        isRoomSelected && !isAvailable
                          ? { backgroundColor: "rgba(211, 47, 47, 0.04)" }
                          : {}
                      }
                    >
                      <TableCell>
                        {room.roomType}
                        {itemMessage && (
                          <Typography
                            variant="caption"
                            color="error"
                            display="block"
                          >
                            {itemMessage}
                          </Typography>
                        )}
                      </TableCell>
                      {["public", "corporate", "private"].map((sector) => {
                        const price =
                          (room.roomPricing || []).find(
                            (price) => price.sector === sector
                          )?.price || "N/A";
                        return <TableCell key={sector}>Rs. {price}</TableCell>;
                      })}
                      <TableCell>
                        <TextField
                          type="number"
                          inputProps={{ min: 0 }}
                          value={roomQty}
                          onChange={(e) =>
                            onSelectionChange(
                              "room",
                              room.roomTypeId,
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          size="small"
                          sx={{ width: 80 }}
                          disabled={hasSelectedPackage}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {hasSelectedPackage && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Please deselect all packages to select rooms
            </Alert>
          )}
        </>
      )}

      {!hasPackages && !hasRooms && (
        <Typography variant="h6" sx={{ p: 2, color: "red" }}>
          Currently this facility cannot be booked. Please check back later.
        </Typography>
      )}
    </Box>
  );
};

export default SelectionTable;

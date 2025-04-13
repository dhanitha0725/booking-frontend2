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
} from "@mui/material";
import { PackagesDto, RoomDto } from "../../../../types/selectedFacility";

interface SelectionTableProps {
  packages: PackagesDto[];
  rooms: RoomDto[];
  onSelectionChange: (
    type: "package" | "room",
    id: number,
    quantity: number
  ) => void;
  requiresDates: boolean;
}

const SelectionTable = ({
  packages,
  rooms,
  onSelectionChange,
  requiresDates,
}: SelectionTableProps) => {
  const hasPackages = packages.length > 0;
  const hasRooms = rooms.length > 0;

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
                <TableCell>Package</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Public Price</TableCell>
                <TableCell>Corporate Price</TableCell>
                <TableCell>Private Price</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.packageId}>
                  <TableCell>{pkg.packageName}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  {["public", "corporate", "private"].map((sector) => (
                    <TableCell key={sector}>
                      Rs.{" "}
                      {pkg.pricing.find((price) => price.sector === sector)
                        ?.price || "N/A"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <input
                      type="number"
                      min="0"
                      aria-label="Package quantity"
                      onChange={(e) =>
                        onSelectionChange(
                          "package",
                          pkg.packageId,
                          +e.target.value
                        )
                      }
                    />
                  </TableCell>
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
                    <input
                      type="number"
                      min="0"
                      aria-label="Room quantity"
                      onChange={(e) =>
                        onSelectionChange("room", room.roomId, +e.target.value)
                      }
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

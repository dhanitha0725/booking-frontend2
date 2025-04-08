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
import { PackagesDto, RoomDto } from "../../../../types/selectedFacility";

interface SelectionTableProps {
  packages: PackagesDto[];
  rooms: RoomDto[];
}

const SelectionTable = ({ packages, rooms }: SelectionTableProps) => {
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
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.packageId}>
                  <TableCell>{pkg.packageName}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  {["public", "corporate", "private"].map((sector) => (
                    <TableCell key={sector}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.roomId}>
                  <TableCell>{room.roomType}</TableCell>
                  {["public", "corporate", "private"].map((sector) => (
                    <TableCell key={sector}>
                      {room.pricing.find((price) => price.sector === sector)
                        ?.price || "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {!hasPackages && !hasRooms && (
        <Typography variant="h6" sx={{ p: 2 }}>
          No packages or rooms available.
        </Typography>
      )}
    </TableContainer>
  );
};

export default SelectionTable;

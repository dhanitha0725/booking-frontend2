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
import { Info, People, SquareFoot } from "@mui/icons-material";

const RoomSelection = ({
  rooms,
  customerType,
  selectedRooms,
  onRoomSelect,
  duration,
}) => {
  const handleCheckboxChange = (event, roomId) => {
    onRoomSelect(roomId, event.target.checked);
  };

  // Calculate total price based on duration
  const calculatePrice = (basePrice) => {
    return basePrice * (duration || 1);
  };

  return (
    <Box>
      {rooms.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No individual rooms available for this facility.
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
                  Room Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Capacity
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Size
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Amenities
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
              {rooms.map((room) => (
                <TableRow
                  key={room.id}
                  hover
                  selected={selectedRooms.includes(room.id)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.50",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRooms.includes(room.id)}
                      onChange={(e) => handleCheckboxChange(e, room.id)}
                      inputProps={{ "aria-labelledby": `room-${room.id}` }}
                    />
                  </TableCell>
                  <TableCell id={`room-${room.id}`}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {room.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <People
                        fontSize="small"
                        sx={{ mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {room.capacity} people
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SquareFoot
                        fontSize="small"
                        sx={{ mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">{room.size}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {room.amenities.map((amenity, index) => (
                        <Chip
                          key={index}
                          label={amenity}
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
                        ${calculatePrice(room.pricing[customerType])}
                      </Typography>
                      <Tooltip title="Price is for the entire duration">
                        <IconButton size="small">
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      ${room.pricing[customerType]} per day
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

export default RoomSelection;

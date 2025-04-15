import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { TempReservation } from "../../../../types/reservationData";

const ReservationSummary = ({
  reservation,
}: {
  reservation: TempReservation;
}) => {
  console.log("TempReservation:", reservation);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Reservation Details
      </Typography>

      <List dense>
        <ListItem>
          <ListItemText
            primary="Dates"
            secondary={`${new Date(reservation.startDate).toLocaleDateString()} - ${new Date(reservation.endDate).toLocaleDateString()}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Customer Type"
            secondary={reservation.customerType}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Selected Items"
            secondary={reservation.selectedItems
              .map((item) => `${item.quantity}x ${item.type} #${item.itemId}`)
              .join(", ")}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Total"
            secondary={`Rs.${reservation.total.toFixed(2)}`}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default ReservationSummary;

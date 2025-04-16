import { Box, List, ListItem, ListItemText } from "@mui/material";
import { TempReservation } from "../../../../types/reservationData";
import dayjs from "dayjs";

const ReservationSummary = ({
  reservation,
}: {
  reservation: TempReservation;
}) => {
  return (
    <Box sx={{ mb: 1 }}>
      <List dense>
        <ListItem>
          <ListItemText
            primary="Dates"
            secondary={
              reservation.startDate && reservation.endDate
                ? `${dayjs(new Date(reservation.startDate)).format("DD/MM/YYYY")} - ${dayjs(new Date(reservation.endDate)).format("DD/MM/YYYY")}`
                : "Invalid date range"
            }
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

import { Grid, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Check } from "@mui/icons-material";

interface AmenitiesTabProps {
  amenities: string[];
}

const AmenitiesTab: React.FC<AmenitiesTabProps> = ({ amenities }) => {
  return (
    <Grid container spacing={2}>
      {amenities.map((amenity, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ListItem>
            <ListItemIcon>
              <Check color="primary" />
            </ListItemIcon>
            <ListItemText primary={amenity} />
          </ListItem>
        </Grid>
      ))}
    </Grid>
  );
};

export default AmenitiesTab;

import React from "react";
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import api from "../../../services/api";
import { AxiosError } from "axios";
import {
  FullFacilityDetails,
  FullFacilityInfoProps,
} from "../../../types/fullFacilityDetails";

const FullFacilityInfo: React.FC<FullFacilityInfoProps> = ({
  open,
  onClose,
  facilityId,
}) => {
  const [facility, setFacility] = React.useState<FullFacilityDetails | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFacility(null);
      setError(null);
    }
  }, [open]);

  // Clear previous data when facilityId changes
  React.useEffect(() => {
    setFacility(null);
    setError(null);
  }, [facilityId]);

  React.useEffect(() => {
    const fetchFacilityDetails = async () => {
      if (!facilityId || !open) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await api.get(
          `http://localhost:5162/api/Facility/${facilityId}/full-facility-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setFacility(response.data);
        } else {
          setError("No facility data available");
        }
      } catch (err) {
        console.error(`Error fetching facility details:`, err);

        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response) {
          setError(
            `Error: ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to fetch facility details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [facilityId, open]);

  // Render status chip with appropriate color
  const renderStatusChip = (status: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error" = "default";

    switch (status.toLowerCase()) {
      case "active":
        color = "success";
        break;
      case "inactive":
        color = "error";
        break;
      case "maintenance":
        color = "warning";
        break;
      default:
        color = "default";
    }

    return <Chip label={status} color={color} size="small" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {loading
          ? "Loading Facility Details..."
          : facility?.facilityName || "Facility Details"}
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 3,
              alignItems: "center",
            }}
          >
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Loading facility details...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : facility ? (
          <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  {facility.facilityName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>
                    Type: {facility.facilityType}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>
                    Status: {renderStatusChip(facility.status)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">{facility.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <DateRangeIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Created on: {formatDate(facility.createdDate)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>{facility.description}</Typography>

            {facility.attributes.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Attributes
                </Typography>
                <List dense>
                  {facility.attributes.map((attribute, index) => (
                    <ListItem key={index}>
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                      <ListItemText primary={attribute} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {facility.childFacilities.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Child Facilities
                </Typography>
                <List dense>
                  {facility.childFacilities.map((childFacility) => (
                    <ListItem key={childFacility.facilityID}>
                      <ListItemText
                        primary={childFacility.facilityName}
                        secondary={`Type: ${childFacility.facilityType} | Status: ${childFacility.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {facility.images && facility.images.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <Grid container spacing={2}>
                  {facility.images.map((image, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <Box
                        component="img"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                        src={image.url}
                        alt={image.caption || `Facility image ${index + 1}`}
                      />
                      {image.caption && (
                        <Typography variant="caption">
                          {image.caption}
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        ) : (
          <Typography>No facility details available</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FullFacilityInfo;

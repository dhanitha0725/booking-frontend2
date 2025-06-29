import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../services/api";
import PackageTable from "./PackageTable";
import RoomPricingTable from "./RoomPricingTable";
import AddPackageDialog from "./AddPackageDialog";
import AddRoomPricingDialog from "./AddRoomPricingDialog";
import { Package, PackageResponse } from "../../../types/packageTypes";
import {
  RoomPricing,
  RoomPricingResponse,
} from "../../../types/roomPricingTypes";

// Custom tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Facility {
  facilityID: number;
  facilityName: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pricing-tabpanel-${index}`}
      aria-labelledby={`pricing-tab-${index}`}
      {...other}
      style={{ marginTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const PriceManagement: React.FC = () => {
  // State for tab management
  const [tabValue, setTabValue] = useState(0);

  // State for data
  const [packages, setPackages] = useState<Package[]>([]);
  const [roomPricings, setRoomPricing] = useState<RoomPricing[]>([]);
  const [facilities, setFacilities] = useState<{ id: number; name: string }[]>(
    []
  );

  // State for loading
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingRoomPricings, setLoadingRoomPricing] = useState(false);

  // State for dialog controls
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [openRoomPricingDialog, setOpenRoomPricingDialog] = useState(false);

  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch facilities for dropdown
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get("/Facility/facility-names");
        const facilityData = response.data.map((facility: Facility) => ({
          id: facility.facilityID, // Changed from facilityId to facilityID
          name: facility.facilityName,
        }));
        setFacilities(facilityData);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        showSnackbar("Failed to load facilities", "error");
      }
    };

    fetchFacilities();
  }, []);

  // Fetch packages
  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const response = await api.get("/Package/packages-details");

      // Check if response has the expected structure with "value" property
      if (response.data && response.data.value) {
        // Transform the response to match the Package interface
        const transformedPackages: Package[] = response.data.value.map(
          (pkg: PackageResponse) => ({
            packageId: pkg.packageId,
            packageName: pkg.packageName,
            duration: pkg.duration,
            facilityId: pkg.facilityId || 0,
            facilityName: pkg.facilityName,
            // Access the pricing data from the nested pricings object
            publicPrice: pkg.pricings.public || 0,
            privatePrice: pkg.pricings.private || 0,
            corporatePrice: pkg.pricings.corporate || 0,
          })
        );

        setPackages(transformedPackages);
      } else {
        // Handle unexpected response structure
        console.error("Unexpected response structure:", response.data);
        showSnackbar("Failed to parse packages data", "error");
        setPackages([]);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      showSnackbar("Failed to load packages", "error");
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  // Fetch room pricing
  const fetchRoomPricing = async () => {
    setLoadingRoomPricing(true);
    try {
      // Use the real API endpoint for room pricing
      const response = await api.get("/facilities/rooms/get-room-pricing");

      // Check if response has the expected structure with "roomPricing" property
      if (response.data && response.data.roomPricing) {
        // Transform the response to match the RoomPricing interface
        const transformedRoomPricings: RoomPricing[] = response.data.roomPricing
          .filter(
            (item: RoomPricingResponse) =>
              item.pricings && Object.keys(item.pricings).length > 0
          ) // Filter out items with empty pricing
          .map((item: RoomPricingResponse) => ({
            pricingId: item.roomTypeId,
            roomTypeId: item.roomTypeId,
            roomTypeName: item.roomTypeName,
            facilityName: item.facilityName,
            totalRooms: item.totalRooms,
            // Access the pricing data from the nested pricing object
            publicPrice: item.pricings.public || 0,
            privatePrice: item.pricings.private || 0,
            corporatePrice: item.pricings.corporate || 0,
          }));

        setRoomPricing(transformedRoomPricings);
      } else {
        // Handle unexpected response structure
        console.error("Unexpected response structure:", response.data);
        showSnackbar("Failed to parse room pricing data", "error");
        setRoomPricing([]);
      }
    } catch (error) {
      console.error("Error fetching room pricing:", error);
      showSnackbar("Failed to load room pricing", "error");
      setRoomPricing([]);
    } finally {
      setLoadingRoomPricing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPackages();
    fetchRoomPricing();
  }, []);

  // Helper function to display snackbar notifications
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle update package
  const handleUpdatePackage = (packageId: number) => {
    // Implementation for updating package
    console.log("Update package:", packageId);
    // You can implement this feature by opening the add dialog with pre-filled data
  };

  // Handle delete package
  const handleDeletePackage = async (packageId: number) => {
    try {
      await api.delete(`/Package/packages/${packageId}`);
      showSnackbar("Package deleted successfully", "success");
      fetchPackages(); // Refresh data
    } catch (error) {
      console.error("Error deleting package:", error);
      showSnackbar("Failed to delete package", "error");
    }
  };

  // Handle update room pricing
  const handleUpdateRoomPricing = (pricingId: number) => {
    // Implementation for updating room pricing
    console.log("Update room pricing:", pricingId);
    // You can implement this feature by opening the add dialog with pre-filled data
  };

  // Handle delete room pricing
  const handleDeleteRoomPricing = async (pricingId: number) => {
    try {
      await api.delete(`/Facility/room-pricings/${pricingId}`);
      showSnackbar("Room pricing deleted successfully", "success");
      fetchRoomPricing(); // Refresh data
    } catch (error) {
      console.error("Error deleting room pricing:", error);
      showSnackbar("Failed to delete room pricing", "error");
    }
  };

  // Handle package dialog success
  const handlePackageSuccess = () => {
    setOpenPackageDialog(false);
    showSnackbar("Package added successfully", "success");
    fetchPackages(); // Refresh packages data
  };

  // Handle room pricing dialog success
  const handleRoomPricingSuccess = () => {
    setOpenRoomPricingDialog(false);
    showSnackbar("Room pricing added successfully", "success");
    fetchRoomPricing(); // Refresh room pricings data
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Pricing Management</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="pricing tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label="Package Pricing"
            id="pricing-tab-0"
            aria-controls="pricing-tabpanel-0"
          />
          <Tab
            label="Room Pricing"
            id="pricing-tab-1"
            aria-controls="pricing-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Package Pricing</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenPackageDialog(true)}
            >
              Add Package
            </Button>
          </Box>

          {loadingPackages ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <PackageTable
              packages={packages}
              onUpdate={handleUpdatePackage}
              onDelete={handleDeletePackage}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Room Pricing</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenRoomPricingDialog(true)}
            >
              Add Room Pricing
            </Button>
          </Box>

          {loadingRoomPricings ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <RoomPricingTable
              roomPricings={roomPricings}
              onUpdate={handleUpdateRoomPricing}
              onDelete={handleDeleteRoomPricing}
            />
          )}
        </TabPanel>
      </Box>

      {/* Add Package Dialog */}
      <AddPackageDialog
        open={openPackageDialog}
        onClose={() => setOpenPackageDialog(false)}
        onSuccess={handlePackageSuccess}
        facilities={facilities}
      />

      {/* Add Room Pricing Dialog */}
      <AddRoomPricingDialog
        open={openRoomPricingDialog}
        onClose={() => setOpenRoomPricingDialog(false)}
        onSuccess={handleRoomPricingSuccess}
        facilities={facilities}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PriceManagement;

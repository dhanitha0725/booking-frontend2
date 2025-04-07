import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import api from "../../../services/api";
import { Facility } from "../../../types/selectedFacility";

const FacilityManagement: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get("/Facility/admin");
        setFacilities(response.data);
      } catch (error) {
        console.error("Error fetching facilities", error);
      }
    };

    fetchFacilities();
  }, []);

  // Define columns for Material React Table
  const columns = useMemo<MRT_ColumnDef<Facility>[]>(
    () => [
      {
        accessorKey: "facilityId",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "facilityName",
        header: "Name",
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        id: "actions",
        header: "Actions",
        size: 150,
        Cell: () => (
          <Button variant="outlined" size="small">
            View Details
          </Button>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: facilities,
    layoutMode: "grid",
    density: "compact",
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Facility Management</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Facility
        </Button>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default FacilityManagement;

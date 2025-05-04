import React, { useMemo } from "react";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { AdminFacilityDetails } from "../../../types/adminFacilityDetails";

interface FacilityTableProps {
  facilities: AdminFacilityDetails[];
  onViewDetails: (facilityId: number) => void;
  onDeleteInitiate: (facilityId: number) => void;
}

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  onViewDetails,
  onDeleteInitiate,
}) => {
  const renderStatusChip = (status: string | undefined | null) => {
    if (!status) {
      return <Chip label="Unknown" color="default" size="small" />;
    }
    const normalizedStatus = status.trim().toLowerCase();
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error" = "default";
    switch (normalizedStatus) {
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

  const columns = useMemo<MRT_ColumnDef<AdminFacilityDetails>[]>(
    () => [
      { accessorKey: "facilityId", header: "ID", size: 100 },
      { accessorKey: "facilityName", header: "Facility Name", size: 200 },
      { accessorKey: "location", header: "Location", size: 500 },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => renderStatusChip(cell.getValue<string>()),
      },
      {
        id: "actions",
        header: "Actions",
        size: 140,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onViewDetails(row.original.facilityId)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteInitiate(row.original.facilityId)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onViewDetails, onDeleteInitiate]
  );

  const table = useMaterialReactTable({
    columns,
    data: facilities,
    layoutMode: "grid",
    muiTableContainerProps: { sx: { maxWidth: "100%" } },
  });

  return <MaterialReactTable table={table} />;
};

export default FacilityTable;

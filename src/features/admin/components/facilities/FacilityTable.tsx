import React, { useMemo } from "react";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { AdminFacilityDetails } from "../../../../types/adminFacilityDetails";

interface FacilityTableProps {
  facilities: AdminFacilityDetails[];
  onViewDetails: (facilityId: number) => void;
}

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  onViewDetails,
}) => {
  // Render status as chips for better UI
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

  // Define columns for Material React Table
  const columns = useMemo<MRT_ColumnDef<AdminFacilityDetails>[]>(
    () => [
      {
        accessorKey: "facilityId",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "facilityName",
        header: "Facility Name",
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => renderStatusChip(cell.getValue<string>()),
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onViewDetails(row.original.facilityId)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [onViewDetails]
  );

  const table = useMaterialReactTable({
    columns,
    data: facilities,
    layoutMode: "grid",
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default FacilityTable;

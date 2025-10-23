import React, { useMemo } from "react";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelIcon from "@mui/icons-material/Hotel";
import DataTable, {
  type DataTableColumn,
  type DataTableConfig,
} from "../../../components/DataTable";
import { AdminFacilityDetails } from "../../../types/adminFacilityDetails";

interface FacilityTableProps {
  facilities: AdminFacilityDetails[];
  onViewDetails: (facilityId: number) => void;
  onDeleteInitiate: (facilityId: number) => void;
  onAddRooms: (facilityId: number) => void;
}

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  onViewDetails,
  onDeleteInitiate,
  onAddRooms,
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

  const columns = useMemo<DataTableColumn<AdminFacilityDetails>[]>(
    () => [
      { accessorKey: "facilityId", header: "ID", size: 100 },
      { accessorKey: "facilityName", header: "Facility Name", size: 200 },
      { accessorKey: "location", header: "Location", size: 500 },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => renderStatusChip(cell.getValue()),
      },
      {
        id: "actions",
        header: "Actions",
        size: 180,
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
            <Tooltip title="Add Rooms">
              <IconButton
                size="small"
                color="success"
                onClick={() => onAddRooms(row.original.facilityId)}
              >
                <HotelIcon />
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
    [onViewDetails, onDeleteInitiate, onAddRooms]
  );

  const config: DataTableConfig = {
    enablePagination: true,
    enableFilters: true,
    enableSorting: true,
    layoutMode: "grid",
  };

  return <DataTable data={facilities} columns={columns} config={config} />;
};

export default FacilityTable;

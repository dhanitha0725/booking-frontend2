import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { RoomPricing } from "../../../types/roomPricingTypes";

interface RoomPricingTableProps {
  roomPricings: RoomPricing[];
  onUpdate: (pricingId: number) => void;
  onDelete: (pricingId: number) => void;
}

const RoomPricingTable: React.FC<RoomPricingTableProps> = ({
  roomPricings,
  onUpdate,
  onDelete,
}) => {
  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<RoomPricing>[]>(
    () => [
      {
        accessorKey: "facilityName",
        header: "Facility",
        size: 200,
        Cell: ({ cell }) => cell.getValue<string>() || "N/A",
      },
      {
        accessorKey: "roomTypeName",
        header: "Room Type",
        size: 200,
      },
      {
        accessorKey: "publicPrice",
        header: "Public Price",
        size: 150,
        Cell: ({ cell }) => `Rs. ${cell.getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "privatePrice",
        header: "Private Price",
        size: 150,
        Cell: ({ cell }) => `Rs. ${cell.getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "corporatePrice",
        header: "Corporate Price",
        size: 150,
        Cell: ({ cell }) => `Rs. ${cell.getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "totalRooms",
        header: "Total Rooms",
        size: 120,
        Cell: ({ cell }) => cell.getValue<number>(),
      },
      {
        id: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit Pricing">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onUpdate(row.original.pricingId)}
                aria-label="Edit room pricing"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Pricing">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(row.original.pricingId)}
                aria-label="Delete room pricing"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onUpdate, onDelete]
  );

  const table = useMaterialReactTable({
    columns,
    data: roomPricings,
    layoutMode: "grid",
    enableRowSelection: false,
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
    initialState: {
      sorting: [
        {
          id: "roomTypeName",
          desc: false,
        },
      ],
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    enablePagination: true,
    enableBottomToolbar: true,
    enableTopToolbar: true,
    enableColumnFilters: true,
    enableColumnOrdering: true,
    enableSorting: true,
  });

  return (
    <Box sx={{ mt: 2 }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default RoomPricingTable;

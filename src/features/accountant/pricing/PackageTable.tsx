import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Package } from "../../../types/packageTypes";

interface PackageTableProps {
  packages: Package[];
  onUpdate: (packageId: number) => void;
  onDelete: (packageId: number) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  onUpdate,
  onDelete,
}) => {
  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<Package>[]>(
    () => [
      {
        accessorKey: "facilityName",
        header: "Facility",
        size: 200,

        Cell: ({ cell }) => cell.getValue<string>() || "N/A",
      },
      {
        accessorKey: "packageName",
        header: "Package Name",
        size: 200,
      },
      {
        accessorKey: "duration",
        header: "Duration",
        size: 150,
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
        id: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit Package">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onUpdate(row.original.packageId)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Package">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(row.original.packageId)}
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
    data: packages,
    layoutMode: "grid",
    enableRowSelection: false,
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
    initialState: {
      sorting: [
        {
          id: "packageName",
          desc: false,
        },
      ],
    },
  });

  return <Box>{<MaterialReactTable table={table} />}</Box>;
};

export default PackageTable;

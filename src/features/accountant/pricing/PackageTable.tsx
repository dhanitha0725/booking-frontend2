import React, { useMemo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable, {
  type DataTableColumn,
  type DataTableConfig,
} from "../../../components/DataTable";
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
  const columns = useMemo<DataTableColumn<Package>[]>(
    () => [
      {
        accessorKey: "facilityName",
        header: "Facility",
        size: 200,
        Cell: ({ cell }) => cell.getValue() || "N/A",
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
        Cell: ({ cell }) => `Rs. ${cell.getValue()}`,
      },
      {
        accessorKey: "privatePrice",
        header: "Private Price",
        size: 150,
        Cell: ({ cell }) => `Rs. ${cell.getValue()}`,
      },
      {
        accessorKey: "corporatePrice",
        header: "Corporate Price",
        size: 150,
        Cell: ({ cell }) => `Rs. ${cell.getValue()}`,
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

  const config: DataTableConfig = {
    enablePagination: true,
    enableFilters: true,
    enableSorting: true,
    layoutMode: "grid",
  };

  return (
    <Box>{<DataTable data={packages} columns={columns} config={config} />}</Box>
  );
};

export default PackageTable;

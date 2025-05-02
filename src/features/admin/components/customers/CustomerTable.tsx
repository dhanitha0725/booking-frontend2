import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, Chip } from "@mui/material";
import { Customer } from "../../../../types/user";

interface CustomerTableProps {
  customers: Customer[]; // Updated to use Customer type
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  // Use chips for roles with appropriate colors based on role type
  const renderRoleChip = (role: string | undefined | null) => {
    if (!role) {
      return <Chip label="Unknown" color="default" size="small" />;
    }

    const normalizedRole = role.trim().toLowerCase();

    // Map backend roles to display values - only two roles: Customer and Guest
    const roleMap: Record<string, string> = {
      customer: "Customer",
      guest: "Guest",
    };

    // Assign colors based on customer role type
    let color: "primary" | "warning" | "default" = "default";

    switch (normalizedRole) {
      case "customer":
        color = "primary";
        break;
      case "guest":
        color = "warning";
        break;
      default:
        color = "default";
    }

    return (
      <Chip
        label={roleMap[normalizedRole] || "Unknown"}
        color={color}
        size="small"
      />
    );
  };

  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<Customer>[]>(
    () => [
      {
        // (first name + last name)
        id: "fullName",
        header: "Full Name",
        size: 200,

        accessorFn: (row) =>
          `${row.firstName || ""} ${row.lastName || ""}`.trim(),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 150,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 150,
        Cell: ({ cell }) => renderRoleChip(cell.getValue<string>()),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: customers,
    layoutMode: "grid",
    enableColumnFilters: true,
    enableGlobalFilter: true,
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
    initialState: {
      sorting: [
        {
          id: "fullName", // Sort by full name initially
          desc: false,
        },
      ],
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CustomerTable;

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, Chip } from "@mui/material";
import { User } from "../../../types/user";

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  // Use chips for roles
  const renderRoleChip = (role: string | undefined | null) => {
    if (!role) {
      return <Chip label="Unknown" color="default" size="small" />;
    }

    const normalizedRole = role.trim().toLowerCase();

    //map backend roles to display values
    const roleMap: Record<string, string> = {
      admin: "Admin",
      accountant: "Accountant",
      employee: "Employee",
      hostel: "Hostel",
    };

    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error" = "default";

    switch (normalizedRole) {
      case "admin":
        color = "primary";
        break;
      case "accountant":
        color = "secondary";
        break;
      case "employee":
        color = "success";
        break;
      case "hostel":
        color = "warning";
        break;
      default:
        color = "default";
    }

    return (
      <Chip
        label={roleMap[normalizedRole] || role}
        color={color}
        size="small"
      />
    );
  };

  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        size: 150,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 150,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 120,
        Cell: ({ cell }) => renderRoleChip(cell.getValue<string>()),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    layoutMode: "grid",
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
  });

  return <Box>{<MaterialReactTable table={table} />}</Box>;
};

export default UserTable;

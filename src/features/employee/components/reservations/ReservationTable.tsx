import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { format } from "date-fns";
import {
  Reservation,
  ReservationStatus,
  UserType,
} from "../../../../types/ReservationDetails";

interface ReservationTableProps {
  reservations: Reservation[];
  onModify?: (reservationId: number) => void;
  onCancel?: (reservationId: number) => void;
  showActions?: boolean;
  enablePagination?: boolean;
  enableFilters?: boolean;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onModify,
  onCancel,
  showActions = true,
  enablePagination = true,
  enableFilters = true,
}) => {
  // Format date for display
  const formatDate = (date: string | Date): string => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  };

  // Render status chips with appropriate colors
  const renderStatusChip = (status: ReservationStatus | undefined | null) => {
    if (!status) {
      return <Chip label="Unknown" color="default" size="small" />;
    }

    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "info" = "default";

    switch (status) {
      case "PendingApproval":
        color = "warning";
        break;
      case "PendingPayment":
        color = "info";
        break;
      case "Approved":
        color = "success";
        break;
      case "Completed":
        color = "primary";
        break;
      case "Cancelled":
        color = "error";
        break;
      case "Confirmed":
        color = "success";
        break;
      case "Expired":
        color = "error";
        break;
      default:
        color = "default";
    }

    return <Chip label={status} color={color} size="small" />;
  };

  // Render user type chips with appropriate colors
  const renderUserTypeChip = (userType: UserType | undefined | null) => {
    if (!userType) {
      return <Chip label="Unknown" color="default" size="small" />;
    }

    let color: "default" | "primary" | "secondary" | "success" | "warning" =
      "default";

    switch (userType) {
      case "public":
        color = "primary";
        break;
      case "private":
        color = "secondary";
        break;
      case "corporate":
        color = "warning";
        break;
      default:
        color = "default";
    }

    // Capitalize first letter for display
    const displayText = userType.charAt(0).toUpperCase() + userType.slice(1);

    return <Chip label={displayText} color={color} size="small" />;
  };

  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<Reservation>[]>(
    () => [
      {
        accessorKey: "reservationId",
        header: "Reservation ID",
        size: 120,
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        size: 160,
        Cell: ({ cell }) => formatDate(cell.getValue<string | Date>()),
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        size: 160,
        Cell: ({ cell }) => formatDate(cell.getValue<string | Date>()),
      },
      {
        accessorKey: "createdDate",
        header: "Created On",
        size: 160,
        Cell: ({ cell }) => formatDate(cell.getValue<string | Date>()),
      },
      {
        accessorKey: "total",
        header: "Total",
        size: 120,
        Cell: ({ cell }) => `Rs. ${cell.getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ cell }) =>
          renderStatusChip(cell.getValue<ReservationStatus>()),
      },
      {
        accessorKey: "userType",
        header: "User Type",
        size: 130,
        Cell: ({ cell }) => renderUserTypeChip(cell.getValue<UserType>()),
      },
      ...(showActions
        ? [
            {
              id: "actions",
              header: "Actions",
              size: 120,
              Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Modify Reservation">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onModify?.(row.original.reservationId)}
                      disabled={
                        row.original.status === "Cancelled" ||
                        row.original.status === "Completed" ||
                        row.original.status === "Expired"
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel Reservation">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onCancel?.(row.original.reservationId)}
                      disabled={
                        row.original.status === "Cancelled" ||
                        row.original.status === "Completed" ||
                        row.original.status === "Expired"
                      }
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]
        : []),
    ],
    [onModify, onCancel, showActions]
  );

  const table = useMaterialReactTable({
    columns,
    data: reservations,
    layoutMode: "grid",
    enablePagination: enablePagination,
    enableFilters: enableFilters,
    enableColumnFilters: enableFilters,
    enableGlobalFilter: enableFilters,
    enableColumnResizing: true,
    enableSorting: true,
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
    initialState: {
      sorting: [
        {
          id: "createdDate",
          desc: true, // Most recent reservations first
        },
      ],
      pagination: { pageSize: 10, pageIndex: 0 }, // Default page size
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default ReservationTable;

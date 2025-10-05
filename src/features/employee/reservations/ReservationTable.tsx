import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";
import {
  Reservation,
  ReservationStatus,
  UserType,
} from "../../../types/ReservationDetails";
import FullReservationInfo from "./FullReservationInfo";

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
  // State for managing reservation details dialog
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | undefined
  >(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle opening the reservation details dialog
  const handleViewReservation = (reservationId: number) => {
    setSelectedReservationId(reservationId);
    setIsDialogOpen(true);
  };

  // Handle closing the reservation details dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

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
      case "PendingPaymentVerification":
        color = "warning";
        break;
      case "PendingCashPayment":
        color = "secondary";
        break;
      case "Approved":
        color = "success";
        break;
      case "Completed":
        color = "success";
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

    return (
      <Chip
        label={status}
        color={color}
        size="small"
        variant="outlined"
        sx={{ borderRadius: "4px" }}
      />
    );
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

    return (
      <Chip
        label={displayText}
        color={color}
        size="small"
        variant="outlined"
        sx={{ borderRadius: "4px" }}
      />
    );
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
        size: 200,
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
              size: 150,
              Cell: ({ row }: { row: { original: Reservation } }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {/* View Details Button */}
                  <Tooltip title="View Reservation Details">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() =>
                        handleViewReservation(row.original.reservationId)
                      }
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Modify Button */}
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

                  {/* Cancel Button */}
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
      pagination: { pageSize: 100, pageIndex: 0 }, // Default page size
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      {/* ReservationTable */}
      <MaterialReactTable table={table} />

      {/* Full Reservation Info Dialog */}
      <FullReservationInfo
        open={isDialogOpen}
        onClose={handleCloseDialog}
        reservationId={selectedReservationId}
      />
    </Box>
  );
};

export default ReservationTable;

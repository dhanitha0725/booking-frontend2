import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// interface to match the API response
interface Invoice {
  invoiceID: number;
  amountPaid: number;
  amountDue: number;
  issuedDate: string;
  reservationID: number;
  paymentID: string;
  paymentMethod: string;
  paymentStatus: string;
}

// Update the props interface
interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (invoiceId: number) => void;
  onDelete: (invoiceId: number) => void;
  isDownloading?: boolean;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  isDownloading = false,
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format invoice number (like UserInfoPage.tsx's orderId format)
  const formatInvoiceNumber = (invoiceId: number): string => {
    return `INV-${invoiceId}-${new Date().getFullYear()}`;
  };

  // Get status chip color based on payment status
  const getStatusChipProps = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { color: "success" as const, variant: "outlined" as const };
      case "pending":
        return { color: "warning" as const, variant: "outlined" as const };
      case "failed":
        return { color: "error" as const, variant: "outlined" as const };
      default:
        return { color: "default" as const, variant: "outlined" as const };
    }
  };

  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceID",
        header: "Invoice #",
        size: 140,
        Cell: ({ cell }) => formatInvoiceNumber(cell.getValue<number>()),
      },
      {
        accessorKey: "reservationID",
        header: "Reservation #",
        size: 140,
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        size: 150,
      },
      {
        accessorKey: "issuedDate",
        header: "Issue Date",
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: "amountPaid",
        header: "Paid Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: "amountDue",
        header: "Due Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorFn: (row) => row.amountPaid + row.amountDue,
        header: "Total Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: "paymentStatus",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const { color, variant } = getStatusChipProps(status);
          return (
            <Chip label={status} color={color} variant={variant} size="small" />
          );
        },
      },
      // Update the actions column
      {
        id: "actions",
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Download Invoice">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onView(row.original.invoiceID)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <CircularProgress size={20} />
                ) : (
                  <FileDownloadIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onView, isDownloading]
  );

  const table = useMaterialReactTable({
    columns,
    data: invoices,
    layoutMode: "grid",
    enableRowSelection: false,
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
    initialState: {
      sorting: [
        {
          id: "issuedDate",
          desc: true,
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

export default InvoiceTable;

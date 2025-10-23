import React, { useMemo } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DataTable, {
  type DataTableColumn,
  type DataTableConfig,
} from "../../../components/DataTable";

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
  const columns = useMemo<DataTableColumn<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceID",
        header: "Invoice #",
        size: 140,
        Cell: ({ cell }) => formatInvoiceNumber(cell.getValue()),
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
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "amountPaid",
        header: "Paid Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        accessorKey: "amountDue",
        header: "Due Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        id: "totalAmount",
        header: "Total Amount",
        size: 140,
        Cell: ({ row }) => {
          const total = row.original.amountPaid + row.original.amountDue;
          return formatCurrency(total);
        },
      },
      {
        accessorKey: "paymentStatus",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const { color, variant } = getStatusChipProps(status);
          return (
            <Chip label={status} color={color} variant={variant} size="small" />
          );
        },
      },
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

  const config: DataTableConfig = {
    enablePagination: true,
    enableFilters: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableColumnResizing: true,
    enableSorting: true,
    layoutMode: "grid",
    pageSize: 10,
  };

  return (
    <Box sx={{ mt: 2 }}>
      <DataTable data={invoices} columns={columns} config={config} />
    </Box>
  );
};

export default InvoiceTable;

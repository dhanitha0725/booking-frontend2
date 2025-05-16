import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";

interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  reservationId: number;
  customerName: string;
  customerType: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: "Paid" | "Partially Paid" | "Unpaid" | "Overdue";
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (invoiceId: number) => void;
  onDelete: (invoiceId: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  onDelete,
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status chip color
  const getStatusChipProps = (status: string) => {
    switch (status) {
      case "Paid":
        return { color: "success" as const, variant: "outlined" as const };
      case "Partially Paid":
        return { color: "warning" as const, variant: "outlined" as const };
      case "Unpaid":
        return { color: "info" as const, variant: "outlined" as const };
      case "Overdue":
        return { color: "error" as const, variant: "outlined" as const };
      default:
        return { color: "default" as const, variant: "outlined" as const };
    }
  };

  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice #",
        size: 140,
      },
      {
        accessorKey: "customerName",
        header: "Customer Name",
        size: 180,
      },
      {
        accessorKey: "customerType",
        header: "Customer Type",
        size: 140,
      },
      {
        accessorKey: "issueDate",
        header: "Issue Date",
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: "paidAmount",
        header: "Paid Amount",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: "balance",
        header: "Balance",
        size: 140,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: "status",
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
      {
        id: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="View Invoice">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onView(row.original.invoiceId)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Invoice">
              <IconButton
                size="small"
                color="secondary"
                onClick={() =>
                  console.log("Print invoice", row.original.invoiceId)
                }
              >
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Invoice">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(row.original.invoiceId)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onView, onDelete]
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
          id: "issueDate",
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

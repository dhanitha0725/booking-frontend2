import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import api from "../../../services/api";
import InvoiceTable from "./InvoiceTable";
import CreateInvoiceDialog from "./CreateInvoiceDialog";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

// Interface for invoice data
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

// TabPanel component for invoice tabs
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invoice-tabpanel-${index}`}
      aria-labelledby={`invoice-tab-${index}`}
      {...other}
      style={{ marginTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const InvoiceManagement: React.FC = () => {
  // State for tab management
  const [tabValue, setTabValue] = useState(0);

  // State for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }>({
    startDate: dayjs().subtract(30, "day"),
    endDate: dayjs(),
  });

  // State for dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // State for snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Effect to filter invoices when filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateRange, invoices]);

  // Function to fetch invoices from API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // This would be replaced with your actual API call
      // const response = await api.get("/Invoice/invoices");
      // setInvoices(response.data);

      // Mock data for demonstration
      setTimeout(() => {
        const mockInvoices: Invoice[] = generateMockInvoices();
        setInvoices(mockInvoices);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      showSnackbar("Failed to load invoices", "error");
      setLoading(false);
    }
  };

  // Generate mock invoice data
  const generateMockInvoices = (): Invoice[] => {
    const statuses: ("Paid" | "Partially Paid" | "Unpaid" | "Overdue")[] = [
      "Paid",
      "Partially Paid",
      "Unpaid",
      "Overdue",
    ];

    const customerTypes = ["Public", "Private", "Corporate"];

    return Array.from({ length: 20 }, (_, i) => {
      const totalAmount = Math.round(Math.random() * 50000) + 5000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paidAmount =
        status === "Paid"
          ? totalAmount
          : status === "Partially Paid"
            ? Math.round(totalAmount * Math.random())
            : 0;

      return {
        invoiceId: i + 1,
        invoiceNumber: `INV-${2023}-${1000 + i}`,
        reservationId: 2000 + i,
        customerName: `Customer ${i + 1}`,
        customerType:
          customerTypes[Math.floor(Math.random() * customerTypes.length)],
        issueDate: dayjs()
          .subtract(Math.floor(Math.random() * 60), "day")
          .format("YYYY-MM-DD"),
        dueDate: dayjs()
          .add(Math.floor(Math.random() * 30), "day")
          .format("YYYY-MM-DD"),
        totalAmount,
        paidAmount,
        balance: totalAmount - paidAmount,
        status,
      };
    });
  };

  // Function to apply filters to invoices
  const applyFilters = () => {
    let filtered = [...invoices];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.reservationId.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((invoice) => {
        const issueDate = dayjs(invoice.issueDate);
        return (
          issueDate.isAfter(dateRange.startDate) &&
          issueDate.isBefore(dateRange.endDate.add(1, "day"))
        );
      });
    }

    setFilteredInvoices(filtered);
  };

  // Helper function to display snackbar notifications
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle creating a new invoice
  const handleCreateInvoice = () => {
    setOpenCreateDialog(true);
  };

  // Handle invoice creation success
  const handleInvoiceCreated = () => {
    setOpenCreateDialog(false);
    showSnackbar("Invoice created successfully", "success");
    fetchInvoices();
  };

  // Handle invoice view/edit
  const handleViewInvoice = (invoiceId: number) => {
    console.log("View invoice:", invoiceId);
    // Implementation would navigate to invoice detail page or open modal
  };

  // Handle invoice deletion
  const handleDeleteInvoice = async (invoiceId: number) => {
    try {
      // This would be your actual API call
      // await api.delete(`/Invoice/invoices/${invoiceId}`);

      // For mock demonstration
      setInvoices((prev) => prev.filter((inv) => inv.invoiceId !== invoiceId));
      showSnackbar("Invoice deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      showSnackbar("Failed to delete invoice", "error");
    }
  };

  // Get different invoice lists based on status
  const paidInvoices = filteredInvoices.filter((inv) => inv.status === "Paid");
  const unpaidInvoices = filteredInvoices.filter(
    (inv) => inv.status === "Unpaid" || inv.status === "Partially Paid"
  );
  const overdueInvoices = filteredInvoices.filter(
    (inv) => inv.status === "Overdue"
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Invoice Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Create, manage, and track invoices for facility bookings
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Search and Filter Row */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ flexGrow: 1, minWidth: "200px" }}
          />

          <FormControl size="small" sx={{ minWidth: "150px" }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Partially Paid">Partially Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="From Date"
            value={dateRange.startDate}
            onChange={(newValue) =>
              setDateRange({ ...dateRange, startDate: newValue })
            }
            slotProps={{ textField: { size: "small" } }}
          />

          <DatePicker
            label="To Date"
            value={dateRange.endDate}
            onChange={(newValue) =>
              setDateRange({ ...dateRange, endDate: newValue })
            }
            slotProps={{ textField: { size: "small" } }}
          />

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => console.log("Export invoices")}
          >
            Export
          </Button>
        </Box>

        {/* Filter Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {statusFilter !== "all" && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => setStatusFilter("all")}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {dateRange.startDate && (
            <Chip
              label={`From: ${dateRange.startDate.format("DD/MM/YYYY")}`}
              onDelete={() => setDateRange({ ...dateRange, startDate: null })}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {dateRange.endDate && (
            <Chip
              label={`To: ${dateRange.endDate.format("DD/MM/YYYY")}`}
              onDelete={() => setDateRange({ ...dateRange, endDate: null })}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {(statusFilter !== "all" ||
            dateRange.startDate ||
            dateRange.endDate) && (
            <Chip
              label="Clear All"
              onClick={() => {
                setStatusFilter("all");
                setDateRange({
                  startDate: dayjs().subtract(30, "day"),
                  endDate: dayjs(),
                });
              }}
              size="small"
              color="secondary"
            />
          )}
        </Box>

        {/* Status Count Cards */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3, flexWrap: "wrap" }}
          justifyContent="space-between"
        >
          <Box
            sx={{
              bgcolor: "#e8f5e9",
              p: 2,
              borderRadius: 1,
              minWidth: "170px",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6" color="success.main">
              {paidInvoices.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paid Invoices
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#fff8e1",
              p: 2,
              borderRadius: 1,
              minWidth: "170px",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6" color="warning.main">
              {unpaidInvoices.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unpaid Invoices
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#ffebee",
              p: 2,
              borderRadius: 1,
              minWidth: "170px",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6" color="error.main">
              {overdueInvoices.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Invoices
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#e3f2fd",
              p: 2,
              borderRadius: 1,
              minWidth: "170px",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6" color="primary.main">
              {filteredInvoices
                .reduce((sum, inv) => sum + inv.balance, 0)
                .toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Outstanding (Rs.)
            </Typography>
          </Box>
        </Stack>

        {/* Tabs for different invoice views */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="invoice tabs"
          >
            <Tab label="All Invoices" id="invoice-tab-0" />
            <Tab label="Unpaid" id="invoice-tab-1" />
            <Tab label="Paid" id="invoice-tab-2" />
            <Tab label="Overdue" id="invoice-tab-3" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <InvoiceTable
              invoices={filteredInvoices}
              onView={handleViewInvoice}
              onDelete={handleDeleteInvoice}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <InvoiceTable
              invoices={unpaidInvoices}
              onView={handleViewInvoice}
              onDelete={handleDeleteInvoice}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <InvoiceTable
              invoices={paidInvoices}
              onView={handleViewInvoice}
              onDelete={handleDeleteInvoice}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <InvoiceTable
              invoices={overdueInvoices}
              onView={handleViewInvoice}
              onDelete={handleDeleteInvoice}
            />
          )}
        </TabPanel>

        {/* Create Invoice Dialog */}
        <CreateInvoiceDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onSuccess={handleInvoiceCreated}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default InvoiceManagement;

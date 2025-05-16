import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  Autocomplete,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../../services/api";
import { AxiosError } from "axios";

// Interface for Reservation used in lookup
interface Reservation {
  reservationId: number;
  customerName: string;
  customerType: string;
  totalAmount: number;
}

// Interface for invoice form data
interface InvoiceFormData {
  reservationId: number | null;
  customerName: string;
  customerType: string;
  customerEmail: string;
  customerPhone: string;
  issueDate: Dayjs;
  dueDate: Dayjs;
  items: InvoiceItem[];
  notes: string;
  totalAmount: number;
}

// Interface for invoice item
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Backend error response interface
interface BackendError {
  message?: string;
  error?: {
    message?: string;
  };
}

// Props for the dialog component
interface CreateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Validation schema for invoice form
const invoiceSchema = z.object({
  reservationId: z.number().nullable(),
  customerName: z
    .string()
    .min(3, "Customer name must be at least 3 characters"),
  customerType: z.string().min(1, "Please select a customer type"),
  customerEmail: z.string().email("Invalid email format"),
  customerPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  issueDate: z.any(),
  dueDate: z.any(),
  items: z
    .array(
      z.object({
        id: z.string(),
        description: z.string().min(3, "Description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(1, "Unit price must be greater than 0"),
        total: z.number(),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
  totalAmount: z.number().min(0),
});

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      reservationId: null,
      customerName: "",
      customerType: "",
      customerEmail: "",
      customerPhone: "",
      issueDate: dayjs(),
      dueDate: dayjs().add(30, "day"),
      items: [
        { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 },
      ],
      notes: "",
      totalAmount: 0,
    },
  });

  // Watch items to recalculate total
  const items = watch("items");

  // Reset form when dialog is opened or closed
  React.useEffect(() => {
    if (!open) {
      reset();
      setError(null);
      setSelectedReservation(null);
    } else {
      fetchNextInvoiceNumber();
      fetchReservations();
    }
  }, [open, reset]);

  // Recalculate totals when items change
  useEffect(() => {
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    setValue("totalAmount", totalAmount);
  }, [items, setValue]);

  // Fetch reservations for dropdown
  const fetchReservations = async () => {
    try {
      // This would be your actual API call
      // const response = await api.get("/Reservation/with-customers");
      // setReservations(response.data);

      // Mock data for demonstration
      const mockReservations: Reservation[] = Array.from(
        { length: 10 },
        (_, i) => ({
          reservationId: 2000 + i,
          customerName: `Customer ${i + 1}`,
          customerType: ["Public", "Private", "Corporate"][i % 3],
          totalAmount: Math.round(Math.random() * 50000) + 5000,
        })
      );

      setReservations(mockReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Failed to load reservations");
    }
  };

  // Fetch next invoice number
  const fetchNextInvoiceNumber = async () => {
    try {
      // This would be your actual API call
      // const response = await api.get("/Invoice/next-number");
      // setNextInvoiceNumber(response.data.invoiceNumber);

      // Mock data for demonstration
      setNextInvoiceNumber(
        `INV-${new Date().getFullYear()}-${1000 + Math.floor(Math.random() * 1000)}`
      );
    } catch (error) {
      console.error("Error fetching next invoice number:", error);
      setError("Failed to generate invoice number");
    }
  };

  // Handle reservation selection
  const handleReservationChange = (reservation: Reservation | null) => {
    setSelectedReservation(reservation);

    if (reservation) {
      setValue("reservationId", reservation.reservationId);
      setValue("customerName", reservation.customerName);
      setValue("customerType", reservation.customerType);

      // Create a new item with the reservation details
      setValue("items", [
        {
          id: "1",
          description: `Reservation #${reservation.reservationId}`,
          quantity: 1,
          unitPrice: reservation.totalAmount,
          total: reservation.totalAmount,
        },
      ]);
    }
  };

  // Handle adding a new item
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: String(items.length + 1),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };

    setValue("items", [...items, newItem]);
  };

  // Handle removing an item
  const handleRemoveItem = (idToRemove: string) => {
    if (items.length > 1) {
      setValue(
        "items",
        items.filter((item) => item.id !== idToRemove)
      );
    }
  };

  // Handle item field change
  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate total if quantity or unitPrice changes
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }

        return updatedItem;
      }
      return item;
    });

    setValue("items", updatedItems);
  };

  const onSubmit: SubmitHandler<InvoiceFormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Format data for API
      const payload = {
        invoiceNumber: nextInvoiceNumber,
        reservationId: data.reservationId,
        customerName: data.customerName,
        customerType: data.customerType,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        issueDate: data.issueDate.format("YYYY-MM-DD"),
        dueDate: data.dueDate.format("YYYY-MM-DD"),
        items: data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        notes: data.notes,
        totalAmount: data.totalAmount,
        status: "Unpaid",
      };

      console.log("Creating invoice:", payload);

      // This would be your actual API call
      // await api.post("/Invoice/create", payload);

      // For demonstration, just wait a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      reset();
    } catch (error) {
      console.error("Error creating invoice:", error);

      // Extract error message from various possible formats
      const err = error as AxiosError<BackendError>;
      let errorMessage = "Failed to create invoice. Please try again.";

      if (err.response?.data) {
        if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error;
        } else if (err.response.data.error?.message) {
          errorMessage = err.response.data.error.message;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create New Invoice</DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Invoice Number */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Invoice Number"
                value={nextInvoiceNumber}
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            {/* Reservation Lookup */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={reservations}
                getOptionLabel={(option) =>
                  `#${option.reservationId} - ${option.customerName}`
                }
                value={selectedReservation}
                onChange={(_, newValue) => handleReservationChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Link to Reservation (Optional)"
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* Customer Information Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer Information
                </Typography>
              </Divider>
            </Grid>

            {/* Customer Name */}
            <Grid item xs={12} md={4}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Name"
                    fullWidth
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                  />
                )}
              />
            </Grid>

            {/* Customer Type */}
            <Grid item xs={12} md={4}>
              <Controller
                name="customerType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.customerType}>
                    <InputLabel>Customer Type</InputLabel>
                    <Select {...field} label="Customer Type">
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="Public">Public</MenuItem>
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="Corporate">Corporate</MenuItem>
                    </Select>
                    {errors.customerType && (
                      <Typography color="error" variant="caption">
                        {errors.customerType.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Customer Email */}
            <Grid item xs={12} md={4}>
              <Controller
                name="customerEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Email"
                    fullWidth
                    error={!!errors.customerEmail}
                    helperText={errors.customerEmail?.message}
                  />
                )}
              />
            </Grid>

            {/* Customer Phone */}
            <Grid item xs={12} md={4}>
              <Controller
                name="customerPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Phone"
                    fullWidth
                    error={!!errors.customerPhone}
                    helperText={errors.customerPhone?.message}
                  />
                )}
              />
            </Grid>

            {/* Issue Date */}
            <Grid item xs={12} md={4}>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Issue Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.issueDate,
                        helperText: errors.issueDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Due Date */}
            <Grid item xs={12} md={4}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Due Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dueDate,
                        helperText: errors.dueDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Items Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Invoice Items
                </Typography>
              </Divider>
            </Grid>

            {/* Items List */}
            <Grid item xs={12}>
              {items.map((item, index) => (
                <Grid container spacing={2} key={item.id} sx={{ mb: 2 }}>
                  {/* Item Description */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      fullWidth
                      error={!!errors.items?.[index]?.description}
                      helperText={errors.items?.[index]?.description?.message}
                    />
                  </Grid>

                  {/* Item Quantity */}
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                      error={!!errors.items?.[index]?.quantity}
                      helperText={errors.items?.[index]?.quantity?.message}
                    />
                  </Grid>

                  {/* Item Unit Price */}
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Unit Price"
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "unitPrice",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                      error={!!errors.items?.[index]?.unitPrice}
                      helperText={errors.items?.[index]?.unitPrice?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Rs.</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Item Total */}
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Total"
                      type="number"
                      value={item.total}
                      disabled
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Rs.</InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  {/* Remove Item Button */}
                  {items.length > 1 && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove Item
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}

              <Button variant="outlined" onClick={handleAddItem} sx={{ mt: 1 }}>
                Add Item
              </Button>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Additional notes or payment instructions..."
                  />
                )}
              />
            </Grid>

            {/* Total Amount */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Amount: Rs. {watch("totalAmount").toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateInvoiceDialog;

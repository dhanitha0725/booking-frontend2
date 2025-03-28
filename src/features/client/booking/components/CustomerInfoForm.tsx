import { TextField, Paper, Grid, Typography, Box } from "@mui/material";
import DocumentUpload from "./DocumentUpload";

interface CustomerInfoFormProps {
  values: {
    name: string;
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  customerType: string;
  onFieldChange: (field: string, value: string) => void;
}

const CustomerInfoForm = ({
  values,
  errors,
  customerType,
  onFieldChange,
}: CustomerInfoFormProps) => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Grid container spacing={3}>
          {/* customer info fields */}
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              value={values.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              value={values.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value={values.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
        </Grid>
      </Paper>
      {(customerType === "public" ||
        customerType === "corporative" ||
        customerType === "private") && (
        <DocumentUpload customerType={customerType} />
      )}
    </Box>
  );
};

export default CustomerInfoForm;

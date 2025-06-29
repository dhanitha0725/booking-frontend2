import { TextField, Grid } from "@mui/material";
import { TempReservation, UserInfo } from "../../../../types/reservationData";

// properties for the UserForm component
interface UserFormProps {
  customerType: TempReservation["customerType"];
  formData: UserInfo;
  onFormChange: (updatedFormData: UserInfo) => void;
}

// UserForm component for collecting user information
const UserForm = ({
  customerType,
  formData = { firstName: "", lastName: "", email: "" },
  onFormChange,
}: UserFormProps) => (
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <TextField
        required
        label="First Name"
        fullWidth
        value={formData?.firstName || ""}
        onChange={(e) =>
          onFormChange({ ...formData, firstName: e.target.value })
        }
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        required
        label="Last Name"
        fullWidth
        value={formData?.lastName || ""}
        onChange={(e) =>
          onFormChange({ ...formData, lastName: e.target.value })
        }
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        label="Email"
        type="email"
        fullWidth
        value={formData?.email || ""}
        onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Phone Number"
        fullWidth
        value={formData?.phoneNumber || ""}
        onChange={(e) =>
          onFormChange({ ...formData, phoneNumber: e.target.value })
        }
      />
    </Grid>
    {customerType !== "private" && (
      <Grid item xs={12}>
        <TextField
          label="Organization Name"
          fullWidth
          value={formData?.organizationName || ""}
          onChange={(e) =>
            onFormChange({ ...formData, organizationName: e.target.value })
          }
        />
      </Grid>
    )}
  </Grid>
);

export default UserForm;

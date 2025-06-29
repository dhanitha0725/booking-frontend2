import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addUserSchema,
  AddUserFormData,
} from "../../../validations/addUserValidation";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: AddUserFormData) => void;
}

// Define the roles available for selection
const roles = ["Admin", "Employee", "Accountant", "Hostel"];

// AddUserDialog component for adding a new user
const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  onSubmitSuccess,
}) => {
  // Form setup using react-hook-form with zod for validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: undefined,
    },
  });

  // reset form when the dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: undefined,
      });
    }
  }, [open, reset]);

  // Handle form submission
  const onSubmit: SubmitHandler<AddUserFormData> = (data) => {
    console.log("Form Data:", data);
    onSubmitSuccess(data);
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Phone Number"
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.role}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  {...field}
                  labelId="role-select-label"
                  label="Role"
                  value={field.value || ""} // Ensure value is never undefined
                >
                  <MenuItem value="" disabled>
                    <em>Select Role</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserDialog;

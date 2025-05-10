import React from "react";
import { Box, Grid, TextField, Alert } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { UserInfo } from "../../../../types/reservationData";
import { CustomerType } from "../../../../types/employeeReservation";

interface UserInfoStepProps {
  formMethods: UseFormReturn<UserInfo>;
  customerType: CustomerType;
  error: string | null;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({
  formMethods,
  customerType,
  error,
}) => {
  const {
    control,
    formState: { errors },
  } = formMethods;

  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
          </Grid>
          {(customerType === "corporate" || customerType === "public") && (
            <Grid item xs={12}>
              <Controller
                name="organizationName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Organization Name"
                    fullWidth
                    error={!!errors.organizationName}
                    helperText={errors.organizationName?.message}
                    required={
                      customerType === "corporate" || customerType === "public"
                    }
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
};

export default UserInfoStep;

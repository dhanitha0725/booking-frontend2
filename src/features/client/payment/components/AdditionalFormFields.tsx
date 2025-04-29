import React from "react";
import { Grid, TextField } from "@mui/material";

interface AdditionalFormFieldsProps {
  userDetails: {
    address: string;
    city: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
}

const AdditionalFormFields: React.FC<AdditionalFormFieldsProps> = ({
  userDetails,
  onChange,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          required
          label="Address"
          fullWidth
          value={userDetails.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          label="City"
          fullWidth
          value={userDetails.city}
          onChange={(e) => onChange("city", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Country"
          fullWidth
          value={userDetails.country}
          disabled
        />
      </Grid>
    </>
  );
};

export default AdditionalFormFields;

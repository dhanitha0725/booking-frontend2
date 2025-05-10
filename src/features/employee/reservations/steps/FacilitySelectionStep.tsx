import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { Facility } from "../../../../types/employeeReservation";

interface FacilitySelectionStepProps {
  facilities: Facility[];
  selectedFacilityId: number | null;
  onFacilityChange: (facilityId: number) => void;
  loading: boolean;
  error: string | null;
}

const FacilitySelectionStep: React.FC<FacilitySelectionStepProps> = ({
  facilities,
  selectedFacilityId,
  onFacilityChange,
  loading,
  error,
}) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    onFacilityChange(event.target.value as number);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth error={!!error && !selectedFacilityId}>
        <InputLabel id="facility-select-label">Select Facility</InputLabel>
        <Select
          labelId="facility-select-label"
          value={selectedFacilityId || ""}
          onChange={handleChange}
          disabled={loading}
          label="Select Facility"
        >
          {facilities.map((facility) => (
            <MenuItem key={facility.facilityID} value={facility.facilityID}>
              {facility.facilityName}
            </MenuItem>
          ))}
        </Select>
        {!!error && !selectedFacilityId && (
          <FormHelperText>{error}</FormHelperText>
        )}
      </FormControl>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default FacilitySelectionStep;

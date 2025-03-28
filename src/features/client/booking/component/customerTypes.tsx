import {
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  styled,
} from "@mui/material";
import { Person, Business, Groups } from "@mui/icons-material";

export type CustomerType = "corporate" | "private" | "walk-in";

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    marginLeft: theme.spacing(1), // Adjust margin as needed
  },
}));

const customerTypes = [
  {
    value: "walk-in",
    label: "Walk-in",
    description: "Pay at the counter, no reservation needed.",
    icon: <Person fontSize="large" color="primary" />,
  },
  {
    value: "private",
    label: "Private",
    description: "For private events and gatherings.",
    icon: <Groups fontSize="large" color="primary" />,
  },
  {
    value: "corporate",
    label: "Corporate",
    description: "For corporate events and business meetings.",
    icon: <Business fontSize="large" color="primary" />,
  },
];

export const CustomerTypeSelector = ({
  customerType,
  onCustomerTypeChange,
}: {
  customerType: CustomerType;
  onCustomerTypeChange: (value: CustomerType) => void;
}) => {
  return (
    <Box>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="customer-type"
          name="customer-type"
          value={customerType}
          onChange={(e) => onCustomerTypeChange(e.target.value as CustomerType)}
          row
        >
          {customerTypes.map((type) => (
            <StyledFormControlLabel
              key={type.value}
              value={type.value}
              control={<Radio />}
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body1">{type.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {type.description}
                  </Typography>
                </Box>
              }
              sx={{ flexDirection: "column" }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

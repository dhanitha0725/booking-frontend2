import { Stepper, Step, StepLabel } from "@mui/material";

interface BookingStepperProps {
  activeStep: number;
  steps: string[];
}

const BookingStepper = ({ activeStep, steps }: BookingStepperProps) => {
  return (
    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BookingStepper;

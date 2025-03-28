import { Button, Box } from "@mui/material";

interface NavigationButtonsProps {
  activeStep: number;
  steps: string[];
  onNext: () => void;
  onBack: () => void;
}

const NavigationButtons = ({
  activeStep,
  steps,
  onNext,
  onBack,
}: NavigationButtonsProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={onBack}
        disabled={activeStep === 0}
      >
        Back
      </Button>
      <Button variant="contained" color="primary" onClick={onNext}>
        {activeStep === steps.length - 1 ? "Proceed to payment" : "Next"}
      </Button>
    </Box>
  );
};

export default NavigationButtons;

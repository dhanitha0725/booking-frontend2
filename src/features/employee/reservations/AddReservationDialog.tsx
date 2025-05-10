import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../services/api";
import { UserInfo } from "../../../types/reservationData";
import { userFormValidation } from "../../../validations/userFormValidation";

// Import step components
import FacilitySelectionStep from "./steps/FacilitySelectionStep";
import DateSelectionStep from "./steps/DateSelectionStep";
import ItemSelectionStep from "./steps/ItemSelectionStep";
import UserInfoStep from "./steps/UserInfoStep";
import ReviewStep from "./steps/ReviewStep";

import {
  CustomerType,
  Facility,
  FacilityData,
  BookingItemDto,
} from "../../../types/employeeReservation";

// Dialog props
interface AddReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onReservationCreated: (reservationId: number) => void;
}

// Reservation steps
const steps = [
  "Select Facility",
  "Select Dates",
  "Choose Items",
  "User Information",
  "Review & Confirm",
];

const AddReservationDialog: React.FC<AddReservationDialogProps> = ({
  open,
  onClose,
  onReservationCreated,
}) => {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null
  );
  const [facilityData, setFacilityData] = useState<FacilityData | null>(null);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null as dayjs.Dayjs | null,
    endDate: null as dayjs.Dayjs | null,
  });
  const [customerType, setCustomerType] = useState<CustomerType>("private");
  const [selectedItems, setSelectedItems] = useState<BookingItemDto[]>([]);
  const [requiresDates, setRequiresDates] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form validation for user info
  const userFormMethods = useForm<UserInfo>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      organizationName: "",
    },
  });

  // Effects and handlers - moved to a separate function for clarity
  useEffectAndHandlers();

  // Handle next button with user info validation
  const handleNextClick = () => {
    if (activeStep === 3) {
      userFormMethods.handleSubmit(
        () => handleNext(),
        (errors) => console.log("Form errors:", errors)
      )();
    } else {
      handleNext();
    }
  };

  // Render current step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FacilitySelectionStep
            facilities={facilities}
            selectedFacilityId={selectedFacilityId}
            onFacilityChange={handleFacilityChange}
            loading={loadingFacilities}
            error={error}
          />
        );
      case 1:
        return (
          <DateSelectionStep
            dateRange={dateRange}
            onDateChange={handleDateChange}
            customerType={customerType}
            onCustomerTypeChange={handleCustomerTypeChange}
            requiresDates={requiresDates}
            error={error}
          />
        );
      case 2:
        return (
          <ItemSelectionStep
            facilityData={facilityData}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
            requiresDates={requiresDates}
            dateRange={dateRange}
            customerType={customerType}
            total={total}
            setTotal={setTotal}
            loading={loading}
            error={error}
          />
        );
      case 3:
        return (
          <UserInfoStep
            formMethods={userFormMethods}
            customerType={customerType}
            error={error}
          />
        );
      case 4:
        return (
          <ReviewStep
            facilityName={
              facilities.find((f) => f.facilityId === selectedFacilityId)
                ?.facilityName
            }
            dateRange={dateRange}
            customerType={customerType}
            total={total}
            selectedItems={selectedItems}
            userDetails={userFormMethods.getValues()}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add New Reservation</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNextClick}
            variant="contained"
            disabled={loading}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleCreateReservation}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Creating..." : "Create Reservation"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  // Logic functions
  function useEffectAndHandlers() {
    // Reset state when dialog closes
    useEffect(() => {
      if (!open) {
        setActiveStep(0);
        setSelectedFacilityId(null);
        setFacilityData(null);
        setDateRange({ startDate: null, endDate: null });
        setCustomerType("private");
        setSelectedItems([]);
        setRequiresDates(false);
        setTotal(0);
        userFormMethods.reset();
        setError(null);
      }
    }, [open, userFormMethods]);

    // Fetch facilities
    useEffect(() => {
      const fetchFacilities = async () => {
        if (!open) return;
        setLoadingFacilities(true);
        setError(null);
        try {
          const response = await api.get("/Facility/available-facilities");
          setFacilities(response.data);
        } catch (error) {
          console.error("Error fetching facilities:", error);
          setError("Failed to load facilities. Please try again.");
        } finally {
          setLoadingFacilities(false);
        }
      };
      fetchFacilities();
    }, [open]);

    // Fetch facility details
    useEffect(() => {
      const fetchFacilityDetails = async () => {
        if (!selectedFacilityId) return;
        setLoading(true);
        setError(null);
        try {
          const response = await api.get(`/Facility/${selectedFacilityId}`);
          setFacilityData(response.data);

          const hasRooms =
            response.data.rooms && response.data.rooms.length > 0;
          const hasDateDependentPackages =
            response.data.packages &&
            response.data.packages.some((pkg: any) => pkg.requiresDates);

          setRequiresDates(hasRooms || hasDateDependentPackages);
        } catch (error) {
          console.error("Error fetching facility details:", error);
          setError("Failed to load facility details. Please try again.");
          setFacilityData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchFacilityDetails();
    }, [selectedFacilityId]);
  }

  // Handle next step with validation
  function handleNext() {
    if (activeStep === 0 && !selectedFacilityId) {
      setError("Please select a facility to continue.");
      return;
    }
    if (activeStep === 1) {
      if (requiresDates && (!dateRange.startDate || !dateRange.endDate)) {
        setError("Please select both start and end dates to continue.");
        return;
      }
      if (
        dateRange.startDate &&
        dateRange.endDate &&
        !dateRange.endDate.isAfter(dateRange.startDate)
      ) {
        setError("End date must be after the start date.");
        return;
      }
    }
    if (activeStep === 2 && selectedItems.length === 0) {
      setError("Please select at least one item to continue.");
      return;
    }
    setActiveStep((prev) => prev + 1);
    setError(null);
  }

  // Handle back step
  function handleBack() {
    setActiveStep((prev) => prev - 1);
    setError(null);
  }

  // Handle facility selection
  function handleFacilityChange(facilityId: number) {
    setSelectedFacilityId(facilityId);
    setSelectedItems([]);
  }

  // Handle date changes
  function handleDateChange(newRange: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }) {
    setDateRange(newRange);
  }

  // Handle customer type change
  function handleCustomerTypeChange(type: CustomerType) {
    setCustomerType(type);
    if (type === "private") {
      userFormMethods.setValue("organizationName", "");
    }
  }

  // Handle item selection
  function handleSelectionChange(
    type: "package" | "room",
    id: number,
    quantity: number
  ) {
    const newItems = [...selectedItems];
    const existingItemIndex = newItems.findIndex(
      (item) => item.type === type && item.itemId === id
    );
    if (existingItemIndex >= 0) {
      if (quantity <= 0) {
        newItems.splice(existingItemIndex, 1);
      } else {
        newItems[existingItemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      newItems.push({
        itemId: id,
        type,
        quantity,
        name:
          type === "package"
            ? facilityData?.packages.find((p) => p.packageId === id)
                ?.packageName
            : facilityData?.rooms.find((r) => r.roomTypeId === id)?.roomType,
      });
    }
    setSelectedItems(newItems);
  }

  // Create reservation
  async function handleCreateReservation() {
    setLoading(true);
    setError(null);
    try {
      if (!selectedFacilityId || selectedItems.length === 0) {
        setError("Missing required reservation data.");
        return;
      }

      const reservationData = {
        facilityId: selectedFacilityId,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
        total,
        customerType,
        items: selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          type: item.type,
        })),
        userDetails: userFormMethods.getValues(),
      };

      const response = await api.post(
        "/Reservation/createReservation",
        reservationData
      );

      if (response.data.isSuccess) {
        onReservationCreated(response.data.value.reservationId);
        onClose();
      } else {
        setError(response.data.error || "Failed to create reservation.");
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to create reservation."
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }
};

export default AddReservationDialog;

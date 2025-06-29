import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInfo } from "../../../types/reservationData";
import { userFormValidation } from "../../../validations/userFormValidation";
import employeeReservationService from "../../../services/employeeReservationService";

// Import step components
import FacilitySelectionStep from "./steps/FacilitySelectionStep";
import BookingDateTimePicker from "../../client/booking/components/BookingDateTimePicker"; // Use this instead of DateSelectionStep
import ItemSelectionStep from "./steps/ItemSelectionStep";
import UserInfoStep from "./steps/UserInfoStep";
import ReviewStep from "./steps/ReviewStep";

import {
  CustomerType,
  Facility,
  FacilityData,
  BookingItemDto,
  PaymentInfo,
} from "../../../types/employeeReservation";
import { PackagesDto } from "../../../types/selectedFacility";
import { AvailabilityResponseDto } from "../../client/booking/components/BookingDateTimePicker"; // Import the type

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

// AddReservationDialog component
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
  // Add state for availability check
  const [, setAvailabilityStatus] = useState<AvailabilityResponseDto>({
    isAvailable: false,
    message: "",
  });
  // State for payment info
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentReceived: false,
    paymentMethod: "Cash",
    amountPaid: null,
  });

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
        // Use BookingDateTimePicker instead of DateSelectionStep
        return (
          <Box sx={{ mt: 2 }}>
            <BookingDateTimePicker
              dateRange={dateRange}
              onDateChange={handleDateChange}
              customerType={customerType}
              onCustomerTypeChange={handleCustomerTypeChange}
              required={requiresDates}
              facilityId={selectedFacilityId || undefined}
              selectedItems={selectedItems}
              onAvailabilityChange={handleAvailabilityChange}
              packages={facilityData?.packages || []}
            />
          </Box>
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
            facilityId={selectedFacilityId}
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
              facilities.find((f) => f.facilityID === selectedFacilityId)
                ?.facilityName
            }
            dateRange={dateRange}
            customerType={customerType}
            total={total}
            selectedItems={selectedItems}
            userDetails={userFormMethods.getValues()}
            error={error}
            paymentInfo={paymentInfo}
            onPaymentInfoChange={setPaymentInfo}
          />
        );
      default:
        return null;
    }
  };

  // Render the dialog
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Reservation</DialogTitle>
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

  // handlers and effects
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
          // Fetch facility names from the service
          const facilitiesData =
            await employeeReservationService.getFacilityNames();
          setFacilities(facilitiesData);
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
          // Fetch facility details based on selected facility ID
          const facilityDetails =
            await employeeReservationService.getFacilityDetails(
              selectedFacilityId
            );
          setFacilityData(facilityDetails);

          // check rooms and packages for date requirements
          const hasRooms =
            facilityDetails.rooms && facilityDetails.rooms.length > 0;
          const hasDateDependentPackages =
            facilityDetails.packages &&
            facilityDetails.packages.some(
              (pkg: PackagesDto) => pkg.requiresDates
            );

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

  // Handle availability status change
  function handleAvailabilityChange(status: AvailabilityResponseDto) {
    setAvailabilityStatus(status);
    if (!status.isAvailable && status.message) {
      setError(status.message);
    } else {
      setError(null);
    }
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

      // Validate date range
      const hasRoomsSelected = selectedItems.some(
        (item) => item.type === "room"
      );

      if (dateRange.startDate && dateRange.endDate) {
        // Different validation for rooms vs packages
        if (
          hasRoomsSelected &&
          !dateRange.endDate.isAfter(dateRange.startDate, "day")
        ) {
          setError(
            "For room bookings, check-out date must be at least one day after check-in date."
          );
          return;
        } else if (dateRange.endDate.isBefore(dateRange.startDate)) {
          // For packages, end date still cannot be before start date
          setError("End date cannot be before start date.");
          return;
        }
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
    // Update selected items based on type and id
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

      // Prepare reservation data
      const reservationData = {
        facilityId: selectedFacilityId,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
        total,
        customerType,
        paymentMethod: "Cash",
        isPaymentReceived: paymentInfo.paymentReceived, //come from checkbox result in review step
        items: selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          type: item.type,
        })),
        userDetails: userFormMethods.getValues(),
      };

      // Create reservation using the service
      const response =
        await employeeReservationService.createEmployeeReservation(
          reservationData
        );

      if (response.isSuccess) {
        onReservationCreated(response.value?.reservationId as number);
        onClose();
      } else {
        setError(response.error || "Failed to create reservation.");
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

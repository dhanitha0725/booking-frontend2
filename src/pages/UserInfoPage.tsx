import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import UserForm from "../features/client/ReservationUserInfo/components/UserForm";
import DocumentUpload from "../features/client/ReservationUserInfo/components/DocumentUpload";
import ReservationSummary from "../features/client/ReservationUserInfo/components/ReservationSummary";
import PaymentMethodSelection, {
  PaymentMethod,
} from "../features/client/ReservationUserInfo/components/PaymentMethodSelection";
import { TempReservation, UserInfo } from "../types/reservationData";
import dayjs from "dayjs";
import { userFormValidation } from "../validations/userFormValidation";
import { z } from "zod";
import axios from "axios";
import reservationService from "../services/reservationService";
import { initiatePayment, submitPaymentForm } from "../services/PaymentService";

const steps = ["Booking Details", "User Information", "Confirmation"];

const UserInfoPage = () => {
  const [activeStep] = useState(1);
  const [tempReservation, setTempReservation] =
    useState<TempReservation | null>(null);
  const [formData, setFormData] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    organizationName: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [bankTransferDocuments, setBankTransferDocuments] = useState<File[]>(
    []
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // check if the user has a reservation in local storage
  useEffect(() => {
    const temp = localStorage.getItem("currentReservation");
    if (!temp) navigate("/facilities");
    else {
      const parsedReservation = JSON.parse(temp);
      parsedReservation.startDate = dayjs(parsedReservation.startDate);
      parsedReservation.endDate = dayjs(parsedReservation.endDate);
      setTempReservation(parsedReservation);
    }
  }, [navigate]);

  // Set default payment method based on customer type
  useEffect(() => {
    if (tempReservation?.customerType !== "private") {
      setPaymentMethod("Online");
    }
  }, [tempReservation?.customerType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!tempReservation) throw new Error("Reservation data missing");

      // Validate form data using Zod schema
      userFormValidation.parse(formData);

      // Document validation based on customer type and payment method
      if (
        tempReservation.customerType !== "private" &&
        documents.length === 0
      ) {
        throw new Error(
          "Please upload at least one document for non-private customers."
        );
      }

      // Only validate bank transfer documents for private customers who chose bank transfer
      if (
        tempReservation.customerType === "private" &&
        paymentMethod === "Bank" &&
        bankTransferDocuments.length === 0
      ) {
        throw new Error("Please upload bank transfer receipt.");
      }

      // Use the reservation service to create reservation and upload documents
      const result = await reservationService.createReservationWithDocuments({
        facilityId: tempReservation.facilityId,
        startDate: dayjs(tempReservation.startDate),
        endDate: dayjs(tempReservation.endDate),
        total: tempReservation.total,
        customerType: tempReservation.customerType,
        paymentMethod,
        items: tempReservation.selectedItems,
        userDetails: formData,
        approvalDocuments: documents,
        bankTransferDocuments: bankTransferDocuments,
      });

      // Clear local storage
      localStorage.removeItem("currentReservation");

      // Handle navigation based on customer type and payment method
      if (
        tempReservation.customerType === "private" &&
        paymentMethod === "Online"
      ) {
        // For private customers with online payment, initiate payment directly
        const paymentData = {
          ReservationId: result.reservationId,
          Total: tempReservation.total,
          UserDetails: {
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Email: formData.email,
            PhoneNumber: formData.phoneNumber || "",
          },
          Items: tempReservation.selectedItems,
          CustomerType: tempReservation.customerType,
          StartDate: dayjs(tempReservation.startDate).toISOString(),
          EndDate: dayjs(tempReservation.endDate).toISOString(),
        };

        // Store in localStorage for payment gateway to use if needed
        localStorage.setItem("pendingReservation", JSON.stringify(paymentData));

        // Create and initiate payment request directly
        try {
          const paymentRequest = {
            orderId: `RES-${result.reservationId}-${Date.now()}`,
            amount: tempReservation.total,
            currency: "LKR",
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber || "0000000000",
            address: "National Institute of Co-Operative Development",
            city: "Colombo",
            country: "Sri Lanka",
            items: tempReservation.selectedItems
              .map(
                (item) => `${item.quantity} × ${item.type} (ID: ${item.itemId})`
              )
              .join(", "),
            reservationId: result.reservationId,
          };

          const paymentResponse = await initiatePayment(paymentRequest);

          // Redirect to PayHere
          if (paymentResponse && paymentResponse.actionUrl) {
            submitPaymentForm(paymentResponse);
          } else {
            throw new Error("Invalid payment response from server");
          }
        } catch (paymentError) {
          console.error("Payment initiation error:", paymentError);
          // If payment initiation fails, redirect to confirmation with error status
          navigate("/confirmation", {
            state: {
              reservationId: result.reservationId,
              status: "Cancelled",
              paymentMethod: "Online",
            },
          });
        }
      } else {
        // For all other cases (private with bank/cash or public/corporate customers)
        let status;

        if (tempReservation.customerType === "private") {
          // For private customers with bank transfer or cash
          status =
            paymentMethod === "Bank"
              ? "PendingPaymentVerification"
              : "PendingPayment";
        } else {
          // For public or corporate customers
          status = "PendingApproval";
        }

        navigate("/confirmation", {
          state: {
            reservationId: result.reservationId,
            status: status,
            paymentMethod:
              tempReservation.customerType !== "private"
                ? "Online"
                : paymentMethod,
          },
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors.map((e) => e.message).join(", "));
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tempReservation) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reservation Details
        </Typography>
        <ReservationSummary reservation={tempReservation} />
        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>

          <UserForm
            customerType={tempReservation.customerType}
            formData={formData}
            onFormChange={setFormData}
          />
          <Divider sx={{ my: 3 }} />

          {/* Supporting Documents Section - Only for public or corporate customers */}
          {(tempReservation.customerType === "public" ||
            tempReservation.customerType === "corporate") && (
            <>
              <Typography variant="h6" gutterBottom>
                Supporting Documents
              </Typography>
              <DocumentUpload
                documents={documents}
                onDocumentsChange={setDocuments}
              />
              <Divider sx={{ my: 3 }} />
            </>
          )}

          {/* Payment Method Selection - Only for private customers */}
          {tempReservation.customerType === "private" && (
            <>
              <PaymentMethodSelection
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                bankTransferDocuments={bankTransferDocuments}
                onBankTransferDocumentsChange={setBankTransferDocuments}
                customerType={tempReservation.customerType}
              />
              <Divider sx={{ my: 3 }} />
            </>
          )}

          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ mt: 2, mb: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Complete Reservation"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserInfoPage;

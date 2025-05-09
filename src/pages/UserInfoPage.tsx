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
import api from "../services/api";
import { TempReservation, UserInfo } from "../types/reservationData";
import dayjs from "dayjs";
import { userFormValidation } from "../validations/userFormValidation";
import { z } from "zod";
import axios from "axios";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // check if the user has a reservation in local storage
  // if not, redirect to the facilities page
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

      if (paymentMethod === "bank" && bankTransferDocuments.length === 0) {
        throw new Error("Please upload bank transfer receipt.");
      }

      // Basic user details
      const basicUserDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || "",
        organizationName: formData.organizationName || "",
      };

      // Prepare reservation payload
      const reservationPayload = {
        facilityId: tempReservation.facilityId,
        startDate: dayjs(tempReservation.startDate).toISOString(),
        endDate: dayjs(tempReservation.endDate).toISOString(),
        total: tempReservation.total,
        customerType: tempReservation.customerType,
        paymentMethod: paymentMethod,
        items: tempReservation.selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          type: item.type,
        })),
        userDetails: basicUserDetails,
      };

      console.log(
        "Sending Reservation Payload: ",
        JSON.stringify(reservationPayload, null, 2)
      );

      // Create reservation
      const createRes = await api.post(
        "/Reservation/createReservation",
        reservationPayload
      );

      if (!createRes.data.isSuccess) {
        throw new Error(createRes.data.error || "Failed to create reservation");
      }

      const reservationId = createRes.data.value.reservationId;
      console.log("Reservation ID:", reservationId);

      // Upload approval documents for public/corporate customers
      if (
        (tempReservation.customerType === "public" ||
          tempReservation.customerType === "corporate") &&
        documents.length > 0
      ) {
        const formDataUpload = new FormData();
        formDataUpload.append("ReservationId", reservationId.toString());
        formDataUpload.append("Document.DocumentType", "ApprovalDocument");
        formDataUpload.append("Document.File", documents[0]);

        await api.post("/Reservation/uploadDocument", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Upload bank transfer receipt if payment method is bank transfer
      if (paymentMethod === "bank" && bankTransferDocuments.length > 0) {
        const bankFormData = new FormData();
        bankFormData.append("ReservationId", reservationId.toString());
        bankFormData.append("Document.DocumentType", "PaymentReceipt");
        bankFormData.append("Document.File", bankTransferDocuments[0]);

        await api.post("/Reservation/uploadDocument", bankFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Clear local storage
      localStorage.removeItem("currentReservation");

      // Handle navigation based on payment method
      if (paymentMethod === "online") {
        // For online payment, navigate to payment page
        navigate("/paymentInfo", {
          state: {
            reservationId: reservationId,
            total: tempReservation.total,
            userDetails: basicUserDetails,
            items: tempReservation.selectedItems,
            startDate: dayjs(tempReservation.startDate).toISOString(),
            endDate: dayjs(tempReservation.endDate).toISOString(),
            customerType: tempReservation.customerType,
          },
        });
      } else {
        // For bank transfer or cash payment, navigate to confirmation page
        navigate("/confirmation", {
          state: {
            reservationId: reservationId,
            status:
              paymentMethod === "bank"
                ? "PendingPaymentVerification"
                : "PendingPayment",
            paymentMethod: paymentMethod,
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

          {(tempReservation.customerType === "public" ||
            tempReservation.customerType === "corporate") && (
            <>
              <Typography variant="h6" gutterBottom>
                Supporting Documents
              </Typography>
              <DocumentUpload
                documents={documents}
                onDocumentsChange={setDocuments}
                title="Approval Documents"
                helperText="Upload documents required for reservation approval"
              />
              <Divider sx={{ my: 3 }} />
            </>
          )}

          {/* Payment Method Selection */}
          <PaymentMethodSelection
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            bankTransferDocuments={bankTransferDocuments}
            onBankTransferDocumentsChange={setBankTransferDocuments}
          />

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

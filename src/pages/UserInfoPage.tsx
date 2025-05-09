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

      // document upload validation
      if (
        tempReservation.customerType !== "private" &&
        documents.length === 0
      ) {
        throw new Error(
          "Please upload at least one document for non-private customers."
        );
      }

      // reservation user details
      const basicUserDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || "",
        organizationName: formData.organizationName || "",
      };

      // Prepare reservation payload for all customer types
      const reservationPayload = {
        facilityId: tempReservation.facilityId, // Include facilityId from tempReservation
        startDate: dayjs(tempReservation.startDate).toISOString(),
        endDate: dayjs(tempReservation.endDate).toISOString(),
        total: tempReservation.total,
        customerType: tempReservation.customerType,
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

      // Create reservation using the API service instead of direct axios call
      const createRes = await api.post(
        "/Reservation/createReservation",
        reservationPayload
      );

      if (!createRes.data.isSuccess) {
        throw new Error(createRes.data.error || "Failed to create reservation");
      }

      const reservationId = createRes.data.value.reservationId; // db generated id from response
      console.log("Reservation ID:", reservationId);
      console.log("Reservation created successfully:", createRes.data.value);

      // Handle document upload for public/corporate customers
      if (
        tempReservation.customerType === "public" ||
        tempReservation.customerType === "corporate"
      ) {
        if (documents.length > 0) {
          const formDataUpload = new FormData();
          formDataUpload.append("ReservationId", reservationId.toString());
          formDataUpload.append("Document.DocumentType", "ApprovalDocument");
          formDataUpload.append("Document.File", documents[0]);

          console.log("Uploading Documents for Reservation ID:", reservationId);

          // Use API service for document upload
          await api.post("/Reservation/uploadDocument", formDataUpload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        // Clear local storage and navigate to confirmation
        localStorage.removeItem("currentReservation");
        navigate("/confirmation", {
          state: {
            reservationId: reservationId,
            status: "PendingApproval",
          },
        });
      } else if (tempReservation.customerType === "private") {
        // For private customers, navigate to payment info page
        localStorage.removeItem("currentReservation");
        navigate("/paymentInfo", {
          state: {
            reservationId: reservationId,
            total: tempReservation.total,
            userDetails: basicUserDetails,
            items: tempReservation.selectedItems,
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
            <DocumentUpload
              documents={documents}
              onDocumentsChange={setDocuments}
            />
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

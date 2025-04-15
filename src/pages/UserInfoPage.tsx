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
} from "@mui/material";
import UserForm from "../features/client/ReservationUserInfo/components/UserForm";
import DocumentUpload from "../features/client/ReservationUserInfo/components/DocumentUpload";
import ReservationSummary from "../features/client/ReservationUserInfo/components/ReservationSummary";
import axios from "axios";
import { TempReservation, UserInfo } from "../types/reservationData";
import dayjs from "dayjs";
import { userFormValidationSchema } from "../validations/userFormValidation";
import { z } from "zod";

const steps = ["Booking Details", "User Information", "Confirmation"];

const UserInfoPage = () => {
  const [activeStep] = useState(1);
  const [tempReservation, setTempReservation] =
    useState<TempReservation | null>(null);
  const [formData, setFormData] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem("currentReservation");
    if (!temp) navigate("/facilities");
    else {
      const parsedReservation = JSON.parse(temp);
      parsedReservation.startDate = dayjs(parsedReservation.dates.start);
      parsedReservation.endDate = dayjs(parsedReservation.dates.end);
      setTempReservation(JSON.parse(temp));
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!tempReservation) throw new Error("Reservation data missing");

      // Validate form data using Zod schema
      userFormValidationSchema.parse(formData);

      if (
        tempReservation.customerType !== "private" &&
        documents.length === 0
      ) {
        throw new Error("Please upload at least one document");
      }

      // create reservation
      const reservationPayload = {
        facilityId: tempReservation.facilityId,
        startDate: new Date(tempReservation.startDate).toISOString(),
        endDate: new Date(tempReservation.endDate).toISOString(),
        customerType: tempReservation.customerType,
        items: tempReservation.selectedItems.map((item) => ({
          itemId: item.itemId,
          type: item.type,
          quantity: item.quantity,
        })),
        userDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone || undefined,
          organizationName:
            tempReservation.customerType === "corporate"
              ? formData.organization
              : undefined,
        },
      };

      const createRes = await axios.post(
        "http://localhost:5162/api/Reservation/createReservation",
        reservationPayload
      );

      // Upload documents if required
      if (tempReservation.customerType !== "private") {
        const formData = new FormData();
        formData.append("ReservationId", createRes.data.reservationId);

        documents.forEach((doc, index) => {
          formData.append(
            `Documents[${index}].DocumentType`,
            "ApprovalDocument"
          );
          formData.append(`Documents[${index}].File`, doc);
        });

        await axios.post(
          "http://localhost:5162/api/Reservation/uploadDocument",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      localStorage.removeItem("currentReservation");
      navigate("/confirmation", {
        state: { reservationId: createRes.data.reservationId },
      });
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

          {tempReservation.customerType !== "private" && (
            <DocumentUpload
              documents={documents}
              onDocumentsChange={setDocuments}
            />
          )}

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
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

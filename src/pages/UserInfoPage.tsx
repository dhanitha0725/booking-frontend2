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
    phoneNumber: "",
    organizationName: "",
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
      userFormValidationSchema.parse(formData);

      if (
        tempReservation.customerType !== "private" &&
        documents.length === 0
      ) {
        throw new Error("Please upload at least one document");
      }

      // Create reservation payload
      const reservationPayload = {
        StartDate: dayjs(tempReservation.startDate).toISOString(),
        EndDate: dayjs(tempReservation.endDate).toISOString(),
        Total: tempReservation.total,
        CustomerType: tempReservation.customerType,
        Items: tempReservation.selectedItems.map((item) => ({
          ItemId: item.itemId,
          Quantity: item.quantity,
          Type: item.type,
        })),
        UserDetails: {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          PhoneNumber: formData.phoneNumber || "",
          OrganizationName: formData.organizationName || "",
        },
      };

      console.log(
        "Sending Payload: ",
        JSON.stringify(reservationPayload, null, 2)
      );

      const createRes = await axios.post(
        "http://localhost:5162/api/Reservation/createReservation",
        reservationPayload
      );

      // Upload documents if required
      if (tempReservation.customerType !== "private") {
        const formData = new FormData();
        formData.append(
          "ReservationId",
          createRes.data.value.reservationId.toString()
        );

        if (documents.length > 0) {
          formData.append("Document.DocumentType", "ApprovalDocument");
          formData.append("Document.File", documents[0]);
        }

        console.log(
          "Create Reservation Response:",
          createRes.data.value.reservationId
        );

        console.log("Uploading Documents: ", createRes.data);

        await axios.post(
          "http://localhost:5162/api/Reservation/uploadDocument",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      localStorage.removeItem("currentReservation");
      navigate("/confirmation", {
        state: {
          reservationId: createRes.data.value.reservationId,
        },
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

          {(tempReservation.customerType === "public" ||
            tempReservation.customerType === "corporate") && (
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

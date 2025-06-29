import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { TempReservation } from "../../../../types/reservationData";
import { z } from "zod";

// Schema for validating PDF file uploads
// This schema checks if the uploaded file is a PDF
export const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed",
  });

export const documentUploadSchema = z.object({
  documents: z.array(pdfFileSchema).min(1, "Please upload at least one PDF file"),
});

// Type for the form data based on the schema
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

interface DocumentUploadProps {
  documents: TempReservation["documents"];
  onDocumentsChange: (updatedDocuments: File[]) => void;
}

// DocumentUpload component for uploading required documents
// This component allows users to upload PDF files and displays the uploaded files
const DocumentUpload = ({
  documents = [],
  onDocumentsChange,
}: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  // Function to handle file changes from drag-and-drop or file input
  const handleFileChange = (files: FileList) => {
    if (files.length > 0) {
      onDocumentsChange([files[0]]);
    }
  };

  // Function to remove a file from the uploaded documents
  const removeFile = (index: number) => {
    const newFiles = [...documents];
    newFiles.splice(index, 1);
    onDocumentsChange(newFiles);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Required Documents
      </Typography>

      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileChange(e.dataTransfer.files);
        }}
        sx={{
          border: 2,
          borderColor: dragActive ? "primary.main" : "divider",
          borderRadius: 1,
          p: 2,
          textAlign: "center",
          mb: 2,
        }}
      >
        <input
          type="file"
          onChange={(e) => e.target.files && handleFileChange(e.target.files)}
          style={{ display: "none" }}
          id="document-upload"
        />
        <label htmlFor="document-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadIcon />}
          >
            Upload Documents
          </Button>
        </label>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Drag and drop files here or click to upload
        </Typography>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        Note: If you are a public or corporate sector customer, you must upload
        a letterhead or related documents to prove your organization identity.
        After reviewing your documents, we will send an email to proceed with
        the payment. Please note that the reviewing process may take a few
        hours.
      </Typography>

      {documents.length > 0 && (
        <List dense>
          {documents.map((file: File, index: number) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => removeFile(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(2)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DocumentUpload;

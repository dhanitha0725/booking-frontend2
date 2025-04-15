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

interface DocumentUploadProps {
  documents: TempReservation["documents"];
  onDocumentsChange: (updatedDocuments: File[]) => void;
}

const DocumentUpload = ({
  documents = [],
  onDocumentsChange,
}: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (files: FileList) => {
    const newFiles = Array.from(files);
    onDocumentsChange([...documents, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...documents];
    newFiles.splice(index, 1);
    onDocumentsChange(newFiles);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Required Documents
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
          multiple
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

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  UploadFile,
  Description,
  Delete,
  CheckCircle,
} from "@mui/icons-material";

const DocumentUpload = ({
  customerType,
}: {
  customerType: "corporate" | "private" | "public";
}) => {
  interface UploadedFile {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    uploadDate: Date;
    status: string;
  }

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  //define the accepted file types
  const getRequiredDocuments = () => {
    switch (customerType) {
      case "corporate":
        return [
          { name: "Business License", required: true },
          { name: "Certificate of Insurance", required: true },
          { name: "Tax Exemption Certificate", required: false },
        ];
      case "private":
        return [
          { name: "ID Proof", required: true },
          { name: "Address Proof", required: false },
        ];
      case "public":
        return [
          { name: "Event Permit", required: false },
          { name: "Liability Waiver", required: true },
        ];
      default:
        return [];
    }
  };

  const requiredDocuments = getRequiredDocuments();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);

    // Simulate file validation
    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const processedFiles = newFiles.map((file) => ({
        name: (file as File).name,
        size: (file as File).size,
        type: (file as File).type,
        lastModified: (file as File).lastModified,
        uploadDate: new Date(),
        status: "uploaded",
      }));

      setFiles([...files, ...processedFiles]);
      setUploading(false);
    }, 1500);
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Check if all required documents are uploaded
  const checkRequiredDocumentsUploaded = () => {
    const requiredDocNames = requiredDocuments
      .filter((doc) => doc.required)
      .map((doc) => doc.name.toLowerCase());

    if (requiredDocNames.length === 0) return true;

    const uploadedDocNames = files.map(
      (file) => file.name.toLowerCase().replace(/\.[^/.]+$/, "") // Remove file extension
    );

    return requiredDocNames.every((reqDoc) =>
      uploadedDocNames.some((upDoc) => upDoc.includes(reqDoc.toLowerCase()))
    );
  };

  const allRequiredUploaded = checkRequiredDocumentsUploaded();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Document Upload
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload the following documents. Documents marked with * are
        required.
      </Alert>

      <List>
        {requiredDocuments.map((doc, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Description color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={`${doc.name}${doc.required ? " *" : ""}`}
              secondary={doc.required ? "Required" : "Optional"}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mb: 3, mt: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFile />}
          sx={{ mb: 2 }}
        >
          Upload Documents
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </Button>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Uploading...
            </Typography>
            <LinearProgress />
          </Box>
        )}
      </Box>

      {files.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Documents
          </Typography>

          <List dense>
            {files.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: "background.default",
                  mb: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded ${file.uploadDate.toLocaleTimeString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFile(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {!allRequiredUploaded && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please upload all required documents.
            </Alert>
          )}

          {allRequiredUploaded && (
            <Alert
              icon={<CheckCircle fontSize="inherit" />}
              severity="success"
              sx={{ mt: 2 }}
            >
              All required documents uploaded!
            </Alert>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentUpload;

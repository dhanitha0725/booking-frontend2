import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DocumentApproval from "./DocumentApproval";
import { DocumentDetails } from "../../../types/ReservationDetails";

interface DocumentViewerProps {
  documents: DocumentDetails[];
  groupByType?: boolean;
  title?: string;
  allowApproval?: boolean;
  paymentStatus?: string;
  reservationStatus?: string;
  reservationId: number;
  reservationDetails: {
    total: number;
    userDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
    };
    items: Array<{
      itemId: number;
      quantity: number;
      type: string;
    }>;
  };
  onDocumentStatusChanged?: () => void;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents = [],
  groupByType = true,
  title = "Documents",
  allowApproval = false,
  paymentStatus = "",
  reservationStatus = "",
  reservationId,
  reservationDetails,
  onDocumentStatusChanged,
}) => {
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    severity: "success" | "error";
    documentId?: number;
  } | null>(null);

  if (!documents.length) {
    return null;
  }

  // Group documents by type if requested
  const approvalDocs = groupByType
    ? documents.filter((doc) => doc.documentType === "ApprovalDocument")
    : [];
  const bankReceipts = groupByType
    ? documents.filter((doc) => doc.documentType === "BankReceipt")
    : [];

  // Get file extension
  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "unknown";
  };

  // Check if document is an image
  const isImage = (url: string) => {
    const ext = getFileExtension(url);
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
  };

  // Get document icon based on type
  const getDocumentIcon = (docType: string) => {
    if (docType === "ApprovalDocument") {
      return <DescriptionIcon color="primary" />;
    } else if (docType === "BankReceipt") {
      return <ReceiptIcon color="success" />;
    }
    return <DescriptionIcon />;
  };

  // Handle error and success
  const handleError = (errorMessage: string, docId: number) => {
    setAlertInfo({
      message: errorMessage,
      severity: "error",
      documentId: docId,
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlertInfo(null);
    }, 5000);
  };

  const handleSuccess = (successMessage: string, docId: number) => {
    setAlertInfo({
      message: successMessage,
      severity: "success",
      documentId: docId,
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlertInfo(null);
    }, 5000);

    if (onDocumentStatusChanged) {
      onDocumentStatusChanged();
    }
  };

  // Function to check if approval buttons should be shown
  const showApproval = (doc: DocumentDetails): boolean => {
    // Don't show approval if document is already processed
    if (doc.status?.includes("Approved") || doc.status?.includes("Rejected")) {
      return false;
    }

    // Don't show for bank receipts if payment is completed
    if (
      doc.documentType === "BankReceipt" &&
      paymentStatus.toLowerCase() === "completed"
    ) {
      return false;
    }

    // Don't show approval buttons if reservation is in a final state
    if (["Completed", "Cancelled", "Expired"].includes(reservationStatus)) {
      return false;
    }

    return allowApproval;
  };

  // Function to render a document card
  const renderDocumentCard = (doc: DocumentDetails) => {
    const isPdf = getFileExtension(doc.url) === "pdf";
    const isImg = isImage(doc.url);

    // Base URL for documents
    const baseUrl =
      "https://rmsblobsfiletorage.blob.core.windows.net/rmscontainer/";
    const fullUrl = doc.url.startsWith("http")
      ? doc.url
      : `${baseUrl}${doc.url}`;

    return (
      <Card
        key={doc.documentId}
        variant="outlined"
        sx={{ maxWidth: 280, mb: 2 }}
      >
        {isImg ? (
          <CardMedia
            component="img"
            height="140"
            image={fullUrl}
            alt={`Document ${doc.documentId}`}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isPdf ? "#f8f8f8" : "#f0f0f0",
            }}
          >
            {getDocumentIcon(doc.documentType)}
          </Box>
        )}
        <CardContent sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {doc.documentType === "ApprovalDocument"
              ? "Approval Document"
              : "Bank Receipt"}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            ID: {doc.documentId}
          </Typography>

          {doc.status && (
            <Chip
              label={doc.status}
              size="small"
              color={
                doc.status.toLowerCase().includes("approved")
                  ? "success"
                  : doc.status.toLowerCase().includes("reject")
                    ? "error"
                    : "default"
              }
              sx={{ mt: 1 }}
            />
          )}

          {/* Show alert for this specific document */}
          {alertInfo && alertInfo.documentId === doc.documentId && (
            <Alert
              severity={alertInfo.severity}
              sx={{ mt: 1, fontSize: "0.75rem", py: 0 }}
              onClose={() => setAlertInfo(null)}
            >
              {alertInfo.message}
            </Alert>
          )}
        </CardContent>

        <Divider />

        <CardActions disableSpacing>
          <Tooltip title="Open in new tab">
            <IconButton
              size="small"
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" component="a" href={fullUrl} download>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>

        {showApproval(doc) && reservationDetails && (
          <Box p={1} pt={0}>
            <DocumentApproval
              documentId={doc.documentId}
              documentType={doc.documentType}
              reservationId={reservationId}
              total={reservationDetails.total}
              userDetails={reservationDetails.userDetails}
              items={reservationDetails.items}
              onError={(message) => handleError(message, doc.documentId)}
              onSuccess={(message) => handleSuccess(message, doc.documentId)}
              onApproved={onDocumentStatusChanged}
            />
          </Box>
        )}
      </Card>
    );
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {groupByType ? (
        <>
          {approvalDocs.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Approval Documents
              </Typography>
              <Grid container spacing={2}>
                {approvalDocs.map((doc) => (
                  <Grid item key={doc.documentId} xs={12} sm={6} md={4}>
                    {renderDocumentCard(doc)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {bankReceipts.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Bank Receipts
              </Typography>
              <Grid container spacing={2}>
                {bankReceipts.map((doc) => (
                  <Grid item key={doc.documentId} xs={12} sm={6} md={4}>
                    {renderDocumentCard(doc)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid item key={doc.documentId} xs={12} sm={6} md={4}>
              {renderDocumentCard(doc)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DocumentViewer;

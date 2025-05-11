import React from "react";
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
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { DocumentDetails } from "../../types/ReservationDetails";

interface DocumentViewerProps {
  documents: DocumentDetails[];
  groupByType?: boolean;
  title?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents = [],
  groupByType = true,
  title = "Documents",
}) => {
  if (!documents.length) {
    return null;
  }

  const approvalDocs = groupByType
    ? documents.filter((doc) => doc.documentType === "ApprovalDocument")
    : [];
  const bankReceipts = groupByType
    ? documents.filter((doc) => doc.documentType === "BankReceipt")
    : [];

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "unknown";
  };

  const isImage = (url: string) => {
    const ext = getFileExtension(url);
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
  };

  const getDocumentIcon = (docType: string) => {
    if (docType === "ApprovalDocument") {
      return <DescriptionIcon color="primary" />;
    } else if (docType === "BankReceipt") {
      return <ReceiptIcon color="success" />;
    }
    return <DescriptionIcon />;
  };

  const renderDocumentCard = (doc: DocumentDetails) => {
    const isPdf = getFileExtension(doc.url) === "pdf";
    const isImg = isImage(doc.url);
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
          <Typography variant="caption" color="text.secondary">
            ID: {doc.documentId}
          </Typography>
        </CardContent>
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

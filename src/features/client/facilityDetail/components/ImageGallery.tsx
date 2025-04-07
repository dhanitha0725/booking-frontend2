import { useState } from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ImageNotSupported } from "@mui/icons-material";

interface ImageGalleryProps {
  images: string[];
}

// Fallback component when images fail to load
const ImageFallback = ({ height = 400 }: { height?: number }) => (
  <Box
    sx={{
      height: height,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.04)",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <ImageNotSupported sx={{ fontSize: 50, color: "text.disabled" }} />
    <Typography variant="body1" color="text.disabled">
      No Image Available
    </Typography>
  </Box>
);

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const theme = useTheme();

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // If no images are provided or all images have errors, show a single fallback
  if (!images.length || images.every((_, idx) => imageErrors[idx])) {
    return (
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              height: 400,
              borderRadius: 2,
            }}
          >
            <ImageFallback />
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8}>
        <Paper
          elevation={2}
          sx={{
            height: 400,
            backgroundImage: imageErrors[activeImage]
              ? "none"
              : `url(${images[activeImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
          }}
        >
          {imageErrors[activeImage] && <ImageFallback />}
          {/* Hidden image element to detect loading errors */}
          <img
            src={images[activeImage]}
            alt="Facility"
            style={{ display: "none" }}
            onError={() => handleImageError(activeImage)}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={1}>
          {images.map((image, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                elevation={1}
                sx={{
                  height: 120,
                  backgroundImage: imageErrors[index]
                    ? "none"
                    : `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    index === activeImage
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                  "&:hover": { opacity: 0.9 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setActiveImage(index)}
              >
                {imageErrors[index] && <ImageFallback height={120} />}
                {/* Hidden image element to detect loading errors */}
                <img
                  src={image}
                  alt={`Thumbnail ${index}`}
                  style={{ display: "none" }}
                  onError={() => handleImageError(index)}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ImageGallery;

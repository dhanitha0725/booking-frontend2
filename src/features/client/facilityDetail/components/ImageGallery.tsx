import { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8}>
        <Paper
          elevation={2}
          sx={{
            height: 400,
            backgroundImage: `url(${images[activeImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={1}>
          {images.map((image, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                elevation={1}
                sx={{
                  height: 120,
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    index === activeImage
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={() => setActiveImage(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ImageGallery;

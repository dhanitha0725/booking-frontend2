import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "background.paper", py: 6, mt: "auto" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              NICD Bookings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Making facility booking simple and efficient. Find and book the
              perfect space for your needs.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton size="small" color="primary">
                <Facebook />
              </IconButton>
              <IconButton size="small" color="primary">
                <Twitter />
              </IconButton>
              <IconButton size="small" color="primary">
                <Instagram />
              </IconButton>
              <IconButton size="small" color="primary">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Home
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Facilities
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              How It Works
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              About Us
            </Link>
            <Link href="#" color="text.secondary" display="block">
              Contact
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              123 Some Road
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Polgolla, Kandy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email: polgolla@gmail.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +94 (703) 876-457
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          {"© "}
          {new Date().getFullYear()}
          {" NICD Bookings. All rights reserved."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

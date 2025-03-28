import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Grid,
  Link,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import bgImage from "../assets/images/bg-sign-up.jpeg";
import api from "../services/api";
import { SignUpFormData } from "../types/auth";
import { signUpSchema } from "../validations/signUpValidation";

function SignUp() {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      terms: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: SignUpFormData) => {
    try {
      await api.post("/Auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
      });

      // Navigate to login with success message
      navigate("/login", {
        state: {
          registrationSuccess: true,
          message:
            "Registration successful! You can now login with your credentials.",
        },
      });
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
      }}
    >
      <Card sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="medium">
            Sign Up
          </Typography>
          <Grid container spacing={2} justifyContent="center" mt={1}>
            <Grid item>
              <Link href="#">
                <FacebookIcon />
              </Link>
            </Grid>
            <Grid item>
              <Link href="#">
                <GoogleIcon />
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("firstName")}
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            {...register("lastName")}
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField
            {...register("email")}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("phoneNumber")}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
          <TextField
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register("confirmPassword")}
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>
          <Typography textAlign="center" mt={2}>
            Already have an account?{" "}
            <Link onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default SignUp;

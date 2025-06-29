import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Link,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import bgImage from "../assets/images/bg-sign-up.jpeg";
import { signInSchema, SignInFormData } from "../validations/signInValidation";
import { authService } from "../services/api";
import { decodeToken } from "../utils/token";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for registration success message
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(location.state.message || "Registration successful!");
    }
  }, [location.state]);

  // configure the react form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Handle form submission
  const handleFormSubmit = async (data: SignInFormData) => {
    setLoginError("");
    try {
      const response = await authService.login(data.email, data.password);

      // Decode the token and log it
      const decodedToken = decodeToken(response.token);
      console.log("Decoded Token:", decodedToken);

      // navigate to the home page
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password");
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
            Sign In
          </Typography>
        </Box>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
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
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
          <Typography textAlign="center" mt={2}>
            Don't have an account?{" "}
            <Link
              onClick={() => navigate("/signup")}
              sx={{ cursor: "pointer" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default SignIn;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  Switch,
  Grid,
  Link,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import bgImage from "../assets/images/bg-sign-up.jpeg";
import { useAuth } from "../context/AuthContext";

// Validation schema using Zod
const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Handle form submission
  const onSubmit = async (data: SignInFormData) => {
    setLoginError("");
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/admin");
    } else {
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
          <Grid container spacing={2} justifyContent="center" mt={1}>
            <Grid item>
              <Link href="#">
                <FacebookIcon />
              </Link>
            </Grid>
            <Grid item>
              <Link href="#">
                <GitHubIcon />
              </Link>
            </Grid>
            <Grid item>
              <Link href="#">
                <GoogleIcon />
              </Link>
            </Grid>
          </Grid>
        </Box>
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
          />
          <Box display="flex" alignItems="center" mt={1}>
            <Switch
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <Typography variant="body2">Remember me</Typography>
          </Box>
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

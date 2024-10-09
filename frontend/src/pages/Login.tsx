import {
  Card,
  Container,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../utils/axios";
import useAuthStore from "../hooks/useAuthStore";
import { Navigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof schema>;

export default function Login() {
  const { user } = useAuthStore();

  
  const [showPassword, setShowPassword] = useState(false);
  const { setAccessToken, setUserData } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post(
        "/login",
        { email: data.email, password: data.password },
        { withCredentials: true }
      );
      const { accessToken, user } = response.data;
      setAccessToken(accessToken);
      setUserData({ email: user.email, name: user.name });

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed!");
    }
  };
  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ p: 2, width: { sm: 400, xs: 350 } }}>
        <Typography variant="h4" mb={2}>
          Login
        </Typography>
        <Box
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            error={!!errors.email}
            {...register("email")}
            helperText={errors.email ? errors.email.message : ""}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            {...register("password")}
            helperText={errors.password ? errors.password.message : ""}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

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
import useAuthStore from "../hooks/useAuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../utils/axios";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name is required and should be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
type RegisterFormData = z.infer<typeof schema>;
export default function Register() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
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

  const onSubmit =async (data: RegisterFormData) => {
    try {
       await api.post(
          "/register",
          { email: data.email, password: data.password,name:data.name },
        );
        alert("Registration successful!");
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed!");
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
          Register
        </Typography>
        <Box
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            error={!!errors.name}
            label="Name"
            {...register("name")}
            helperText={errors.name ? errors.name.message?.toString() : ""}
          />

          <TextField
            error={!!errors.email}
            label="Email"
            {...register("email")}
            helperText={errors.email ? errors.email.message?.toString() : ""}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            {...register("password")}
            helperText={
              errors.password ? errors.password.message?.toString() : ""
            }
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
            Register
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

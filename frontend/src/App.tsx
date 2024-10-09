import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {  createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import useTheme from "./hooks/useTheme";
import api from "./utils/axios";
import { lazy, Suspense, useEffect, useState } from "react";
import useAuthStore from "./hooks/useAuthStore";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const { darkMode } = useTheme();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserData = useAuthStore((state) => state.setUserData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await api.get("/refresh-token", {
          withCredentials: true,
        });
        const { accessToken, user } = response.data;
        setAccessToken(accessToken);
        setUserData({ email: user.email, name: user.name });
      } catch (error) {
        console.error("Auto login failed:", error);
      } finally {
        setLoading(false); 
      }
    };
    autoLogin();
  }, [setAccessToken, setUserData]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <Loading/>
      ) : (
        <Router>
          <NavBar />
          <Suspense fallback={<Loading/>}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;

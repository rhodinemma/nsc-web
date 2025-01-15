/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import useParticipantStore from "@/store/participantStore";
import { toast } from "sonner";

const Login = () => {
  const { setUsername, setUserEmail, setToken } = useParticipantStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.nationalscratchcompetition.org/api/login",
        {
          username: email,
          password,
        }
      );

      toast.success("Login successful!");

      setToken(response.data?.access_token);
      setUsername(response.data.user?.name);
      setUserEmail(response.data.user?.email);

      localStorage.setItem("token", response.data?.access_token);

      // Redirect to the dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      toast.error("Failed to login!");
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container style={{ minHeight: "100vh" }}>
        {/* Left Section */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            zIndex: 1,
          }}
        />
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "linear-gradient(135deg, #FF6F61, #FFD54F)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            padding: 4,
            textAlign: "center",
            backgroundImage: `url('/puzzle.svg')`,
            backgroundRepeat: "repeat",
            backgroundSize: "150px 150px",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{ fontWeight: "bold", position: "relative", zIndex: 2 }}
            gutterBottom
          >
            National Scratch Competition
          </Typography>
          <Typography
            variant="h4"
            align="center"
            sx={{ position: "relative", zIndex: 2 }}
          >
            Coding for a brighter future.
          </Typography>
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0A1045",
            position: "relative",
            zIndex: 2,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              padding: 4,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                mb: 2,
                position: "relative",
                zIndex: 2,
              }}
            >
              <img src="/logo.png" alt="Logo" style={{ height: "200px" }} />
            </Box>
            <Typography variant="h5" align="center" gutterBottom>
              Jury Login
            </Typography>
            <Box component="form" noValidate autoComplete="off" mb={2}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;

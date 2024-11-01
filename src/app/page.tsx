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
} from "@mui/material";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    router.push("/dashboard");
  };

  return (
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
          NSC Platform
        </Typography>
        <Typography
          variant="h4"
          align="center"
          sx={{ position: "relative", zIndex: 2 }}
        >
          Explore your creativity with fun coding challenges in Blockly and
          Scratch.
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
            sx={{ textAlign: "center", mb: 2, position: "relative", zIndex: 2 }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: "200px" }} />
          </Box>
          <Typography variant="h5" align="center" gutterBottom>
            Login
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
              // type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
          <Typography variant="body2" align="center">
            <a href="#" style={{ color: "#304ffe" }}>
              Forgot your password?
            </a>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;

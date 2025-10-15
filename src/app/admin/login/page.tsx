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
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import useJuryAuthStore from "@/store/juryStore";

const Login = () => {
  const router = useRouter();

  const { setJuryid, setJuryname, setJuryemail, setJuryToken, setJuryRole } =
    useJuryAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [juryName, setJuryName] = useState("");
  const [juryEmail, setJuryEmail] = useState("");
  const [juryPassword, setJuryPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://nsc-nine-ab95ebc2-4bb5-4518-8d9b.ahumain.cranecloud.io/api/v1/identities/login",
        {
          email,
          password,
        }
      );

      toast.success("Login successful!");

      setJuryToken(response.data?.token);
      setJuryid(response.data.identity?.id);
      setJuryname(response.data.identity?.name);
      setJuryemail(response.data.identity?.email);
      setJuryRole(response.data.identity?.role);

      localStorage.setItem("juryToken", response.data?.token);

      // Redirect to the dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      toast.error("Failed to login!");
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: juryName,
      email: juryEmail,
      passwordHash: juryPassword,
    };

    try {
      const response = await axios.post(
        "https://progressrounds-4f470cd5-1187-4be1-a866.cranecloud.io/api/v1/identities",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Registration successful!");

      console.log("Registration successful:", response.data);

      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to register!");
      console.error("Error registering:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              <Typography variant="body2" align="center">
                <a
                  href="#"
                  onClick={handleOpenDialog}
                  style={{ color: "#304ffe" }}
                >
                  Click here to register
                </a>
              </Typography>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {" "}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Join the Jury team</Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleRegister}>
            <TextField
              fullWidth
              margin="normal"
              label="Full name"
              variant="outlined"
              value={juryName}
              onChange={(e) => setJuryName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              variant="outlined"
              value={juryEmail}
              onChange={(e) => setJuryEmail(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={juryPassword}
              onChange={(e) => setJuryPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Register
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;

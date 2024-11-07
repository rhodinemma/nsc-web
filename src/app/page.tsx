"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import useParticipantStore from "@/store/participantStore";

const Login = () => {
  const { setUsername, setUserEmail, setToken } = useParticipantStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [registrationSection, setRegistrationSection] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [schoolSection, setSchoolSection] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

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

      setToken(response.data?.access_token);
      setUsername(response.data.user?.name);
      setUserEmail(response.data.user?.email);

      // Redirect to the dashboard
      router.push("/dashboard");
    } catch (err) {
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
            {/* <Typography variant="body2" align="center">
              <a href="#" onClick={handleOpen} style={{ color: "#304ffe" }}>
                Have no account? Click here to register
              </a>
            </Typography> */}
            {/* <Typography variant="body2" align="center">
              <a href="#" style={{ color: "#304ffe" }}>
                Forgot your password?
              </a>
            </Typography> */}
          </Box>
        </Grid>
      </Grid>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>National Scratch Competition Registration</DialogTitle>
        <DialogContent>
          {/* Step 1: General Information */}
          <Typography variant="h6" gutterBottom>
            Step 1: General Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Registration Section</InputLabel>
                <Select
                  label="Registration Section"
                  value={registrationSection}
                  onChange={(e) => setRegistrationSection(e.target.value)}
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="team">Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Age Category</InputLabel>
                <Select
                  label="Age Category"
                  value={ageCategory}
                  onChange={(e) => setAgeCategory(e.target.value)}
                >
                  <MenuItem value="junior">Junior (7-10)</MenuItem>
                  <MenuItem value="senior">Senior (11-14)</MenuItem>
                  <MenuItem value="mature">Mature (15-19)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Step 2: School Information */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Step 2: School Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="School" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>School Section</InputLabel>
                <Select
                  label="School Section"
                  value={schoolSection}
                  onChange={(e) => setSchoolSection(e.target.value)}
                >
                  <MenuItem value="primary">Primary</MenuItem>
                  <MenuItem value="secondary">Secondary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Phone" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="School Address" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Person" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="School Email" type="email" />
            </Grid>
          </Grid>

          {/* Step 3: Student Information */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Step 3: Student Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Age" type="number" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Preferred Communication Method</InputLabel>
                <Select label="Preferred Communication Method">
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="phone">Phone Call</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select label="Gender">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Grade/Class" />
            </Grid>
          </Grid>

          {/* Step 3: Guardian Information */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Step 3: Guardian Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Parent / Guardian Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Parent / Guardian Phone" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parent / Guardian Email Address"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    color="primary"
                  />
                }
                label="We, the parents/guardians of the team members, hereby consent to our children's participation in NSC2025 and understand the terms and conditions of the competition."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;

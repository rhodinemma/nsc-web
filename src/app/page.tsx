/* eslint-disable @next/next/no-img-element */
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
import { toast } from "sonner";
import { CheckCircle } from "@mui/icons-material";

const Login = () => {
  const { setUsername, setUserEmail, setToken } = useParticipantStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);

  // Step 1: General Information
  const [registrationSection, setRegistrationSection] = useState("");
  const [ageCategory, setAgeCategory] = useState("");

  // Step 2: School Information
  const [school, setSchool] = useState("");
  const [schoolSection, setSchoolSection] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");

  // Step 3: Student Information
  const [fullName, setFullName] = useState("");
  const [userEmail, setParticipantEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredCommunication, setPreferredCommunication] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [studentGrade, setStudentGrade] = useState("");

  // Step 4: Guardian Information
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    registrationSection: false,
    ageCategory: false,
    school: false,
    schoolSection: false,
    contactPhone: false,
    schoolAddress: false,
    contactPerson: false,
    schoolEmail: false,
    fullName: false,
    userEmail: false,
    age: false,
    phone: false,
    preferredCommunication: false,
    dob: false,
    gender: false,
    studentGrade: false,
    guardianName: false,
    guardianPhone: false,
    guardianEmail: false,
    consentGiven: false,
  });

  // Validation function
  const validateForm = () => {
    const newErrors = { ...errors };

    // Check if any required field is empty
    newErrors.registrationSection = !registrationSection;
    newErrors.ageCategory = !ageCategory;
    newErrors.school = !school;
    newErrors.schoolSection = !schoolSection;
    newErrors.contactPhone = !contactPhone;
    newErrors.schoolAddress = !schoolAddress;
    newErrors.contactPerson = !contactPerson;
    newErrors.schoolEmail = !schoolEmail;
    newErrors.fullName = !fullName;
    newErrors.userEmail = !userEmail;
    newErrors.age = !age;
    newErrors.phone = !phone;
    newErrors.preferredCommunication = !preferredCommunication;
    newErrors.dob = !dob;
    newErrors.gender = !gender;
    newErrors.studentGrade = !studentGrade;
    newErrors.guardianName = !guardianName;
    newErrors.guardianPhone = !guardianPhone;
    newErrors.guardianEmail = !guardianEmail;
    newErrors.consentGiven = !consentGiven;

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).includes(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

      toast.success("Login successful!");

      setToken(response.data?.access_token);
      setUsername(response.data.user?.name);
      setUserEmail(response.data.user?.email);

      // Redirect to the dashboard
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to login!");
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);

    if (!validateForm()) return toast.warning("Please fill in all the fields!");

    const data = {
      fullname: fullName,
      user_email: userEmail,
      registration_category: registrationSection,
      competiton_category: ageCategory,
      age,
      phone,
      preffered_communication: preferredCommunication,
      dob,
      gender,
      school,
      section: schoolSection,
      address: schoolAddress,
      contact_person: contactPerson,
      contact_phone: contactPhone,
      school_email: schoolEmail,
      gaurd_name: guardianName,
      gaurd_email: guardianEmail,
      gaurd_phone: guardianPhone,
    };

    try {
      const response = await axios.post(
        "https://api.nationalscratchcompetition.org/api/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsRegistrationSuccessful(true);
      setOpenModal(true);
      toast.success("Registration successful!");

      setOpen(false);
      console.log("Registration successful:", response.data);
    } catch (error) {
      toast.error("Failed to register!");
      console.error("Error registering:", error);
    } finally {
      setRegistering(false);
    }
  };

  console.log(isRegistrationSuccessful);

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
            <Typography variant="body2" align="center">
              <a href="#" onClick={handleOpen} style={{ color: "#304ffe" }}>
                Have no account? Click here to register
              </a>
            </Typography>
            {/* <Typography variant="body2" align="center">
              <a href="#" style={{ color: "#304ffe" }}>
                Forgot your password?
              </a>
            </Typography> */}
          </Box>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <CheckCircle style={{ fontSize: 100, color: "green" }} />
            <Typography variant="h6" align="center" style={{ marginTop: 10 }}>
              Check your email for login details
            </Typography>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
              <TextField
                fullWidth
                label="School"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                error={errors.school}
                helperText={errors.school ? "School is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={errors.schoolSection}>
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
              <TextField
                fullWidth
                label="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                error={errors.contactPhone}
                helperText={
                  errors.contactPhone ? "Contact phone is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Address"
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                error={errors.schoolAddress}
                helperText={
                  errors.schoolAddress ? "School address is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                error={errors.contactPerson}
                helperText={
                  errors.contactPerson ? "Contact person is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                error={errors.schoolEmail}
                helperText={
                  errors.schoolEmail ? "School email is required" : ""
                }
                type="email"
              />
            </Grid>
          </Grid>

          {/* Step 3: Student Information */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Step 3: Student Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                helperText={errors.fullName ? "Full name is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={errors.age}
                helperText={errors.age ? "Age is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                helperText={errors.phone ? "Phone number is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={errors.preferredCommunication}>
                <InputLabel>Preferred Communication Method</InputLabel>
                <Select
                  label="Preferred Communication Method"
                  value={preferredCommunication}
                  onChange={(e) => setPreferredCommunication(e.target.value)}
                >
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
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                error={errors.dob}
                helperText={errors.dob ? "Date of birth is required" : ""}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                error={errors.userEmail}
                helperText={
                  errors.userEmail ? "Participant Email is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade/Class"
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                error={errors.studentGrade}
                helperText={errors.studentGrade ? "Grade is required" : ""}
              />
            </Grid>
          </Grid>

          {/* Step 4: Guardian Information */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Step 4: Guardian Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guardian Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                error={errors.guardianName}
                helperText={
                  errors.guardianName ? "Guardian name is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guardian Phone"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                error={errors.guardianPhone}
                helperText={
                  errors.guardianPhone ? "Guardian phone is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guardian Email"
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                error={errors.guardianEmail}
                helperText={
                  errors.guardianEmail ? "Guardian email is required" : ""
                }
              />
            </Grid>
          </Grid>

          {/* Consent Checkbox */}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            color="primary"
            variant="contained"
            disabled={
              !consentGiven ||
              registering ||
              Object.values(errors).includes(true)
            }
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;

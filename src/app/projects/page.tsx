"use client";
import Navbar from "@/components/Navbar";
import useParticipantStore from "@/store/participantStore";
import { HourglassDisabled, Upload } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Participant {
  id: number;
  name: string;
  email: string;
}

interface FormData {
  _id?: string;
  title: string;
  subTheme: string;
  participantType: string;
  participants: Participant[];
  description: string;
  file: string | null;
  round: number;
}

const BuildProjectPage = () => {
  const router = useRouter();

  const { email } = useParticipantStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<FormData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [confirmationDialog, setConfirmationDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subTheme: "",
    participantType: "Individual",
    participants: [],
    description: "",
    file: null,
    round: 2,
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [availableParticipants, setAvailableParticipants] = useState<
    Participant[]
  >([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          "https://api.nationalscratchcompetition.org/api/users?page=1&paginator=100",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const participants = response.data.data.data.map(
          (user: Participant) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          })
        );
        setAvailableParticipants(participants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching participants:", error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchParticipantProject = async () => {
      try {
        const response = await axios.post(
          `https://progressbot-vzd5.onrender.com/api/v1/project/participant`,
          {
            email: email,
          }
        );

        setProjects(response.data.data);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to get projects for participant:", error);
      }
    };

    fetchParticipantProject();
  }, [email]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset errors and start upload
    setFileError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://progressbot-vzd5.onrender.com/api/v1/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileId = response.data.data.id;
      handleFormChange("file", fileId);
    } catch (error) {
      setFileError("Failed to upload file. Please try again.");
      console.error("File upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleOpenDeleteDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProjectId("");
  };

  const handleSubmit = () => {
    // ensure file is uploaded
    if (!formData.file) {
      setFileError("Please upload a file before submitting.");
      return;
    }

    setOpenDialog(false);
    setConfirmationDialog(true);
  };

  const handleConfirmation = async () => {
    setConfirmationDialog(false);

    // const transformedParticipants = formData.participants.map(
    //   (participant) => participant.name
    // );

    try {
      const response = await axios.post(
        `https://progressbot-vzd5.onrender.com/api/v1/project`,
        {
          title: formData.title,
          subTheme: formData.subTheme,
          participantType: formData.participantType,
          participant: email,
          description: formData.description,
          file: formData.file,
          round: formData.round,
        }
      );

      console.log("Project submitted successfully:", response.data);
      toast.success("Project submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Error submitting project!");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://progressbot-vzd5.onrender.com/api/v1/project/${selectedProjectId}`
      );

      console.log("Project deleted successfully:", response.data);
      toast.success("Project deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        style={{
          position: "absolute",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
          height: "140vh",
        }}
      />
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF6F61, #FFD54F)",
          color: "white",
          padding: 4,
          textAlign: "center",
          backgroundImage: `url('/puzzle.svg')`,
          backgroundRepeat: "repeat",
          backgroundPosition: "cover",
          height: "100vh",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h4"
            className="title"
            color="secondary"
            sx={{
              margin: "2rem 0 2rem 0",
              color: "white",
              position: "relative",
              zIndex: 2,
            }}
          >
            Build a project
          </Typography>

          {/* Header Section */}
          <Container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "white", position: "relative", zIndex: 2 }}
              >
                My projects
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginRight: 1,
                    cursor: "pointer",
                    color: "white",
                    position: "relative",
                    zIndex: 2,
                  }}
                  onClick={() => router.push("/projects/builder")}
                >
                  + New project
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                  startIcon={<Upload />}
                  sx={{
                    cursor: "pointer",
                    color: "white",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  Submit project
                </Button>
              </Box>
            </Box>

            {/* Content Section */}
            <Grid container spacing={3}>
              {loading ? (
                <Container disableGutters>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="50vh"
                  >
                    <CircularProgress />
                  </Box>
                </Container>
              ) : !loading && projects?.length > 0 ? (
                projects?.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                        textAlign: "center",
                        height: "200px",
                        overflow: "hidden",
                        zIndex: 2,
                      }}
                    >
                      {/* Sub-theme pill */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "16px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {project.subTheme}
                      </Box>

                      <Avatar
                        src={"/puzzle.svg"}
                        alt={project.title}
                        sx={{ width: 56, height: 56, marginBottom: 1 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {project.title}
                      </Typography>

                      {/* Clamped Description */}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          WebkitLineClamp: 2,
                          textOverflow: "ellipsis",
                          textAlign: "left",
                          width: "100%",
                          marginBottom: 4, // Space for buttons
                        }}
                      >
                        {project.description}
                      </Typography>

                      {/* Buttons */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                        }}
                      >
                        {/* <Button variant="text" color="primary" size="small">
                          View details
                        </Button> */}
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                        }}
                      >
                        <Button
                          variant="text"
                          color="warning"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(project._id!)}
                          // onClick={() => handleDelete(project._id)}
                        >
                          Delete project
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Container
                  disableGutters
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="50vh"
                    width="50%"
                    sx={{
                      bgcolor: "whitesmoke",
                      color: "#7d7d7d",
                      borderRadius: "1rem",
                      marginTop: "2rem",
                      marginBottom: "2rem",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <HourglassDisabled style={{ fontSize: 50 }} />
                    <Typography variant="h5">No projects found!</Typography>
                  </Box>
                </Container>
              )}
            </Grid>

            {/* Main Dialog */}
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Submit your project</DialogTitle>
              <DialogContent>
                {/* File Upload */}
                <Box marginBottom={2}>
                  <Typography>
                    Upload your scratch project (.sb3 file)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    color="primary"
                    disabled={uploading}
                    sx={{ marginTop: 1 }}
                  >
                    {uploading ? <CircularProgress size={20} /> : "Choose File"}
                    <input
                      type="file"
                      accept=".sb3"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                  {fileError && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: 1 }}
                    >
                      {fileError}
                    </Typography>
                  )}
                  {formData.file && (
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      File uploaded successfully! File ID: {formData.file}
                    </Typography>
                  )}
                </Box>

                {/* Project Title */}
                <TextField
                  fullWidth
                  label="Project title"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Subtheme */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Sub-theme</InputLabel>
                  <Select
                    label="Sub-theme"
                    value={formData.subTheme}
                    onChange={(e) =>
                      handleFormChange("subTheme", e.target.value)
                    }
                  >
                    <MenuItem value="Health & Wellbeing">
                      Health & Wellbeing
                    </MenuItem>
                    <MenuItem value="Digital Education">
                      Digital Education
                    </MenuItem>
                    <MenuItem value="Sustainability & GreenTech">
                      Sustainability & GreenTech
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Description */}
                <TextField
                  fullWidth
                  label="Brief about or description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                {/* Participant Type */}
                {/* <FormControl fullWidth margin="dense">
                <InputLabel>Participant type</InputLabel>
                <Select
                  label="Participant type"
                  value={formData.participantType}
                  onChange={(e) =>
                    handleFormChange("participantType", e.target.value)
                  }
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Team">Team</MenuItem>
                </Select>
              </FormControl> */}

                {/* Team Participant Selection */}
                {formData.participantType === "Team" && (
                  <Box>
                    <Autocomplete
                      options={availableParticipants}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        if (value) {
                          handleFormChange("participants", [
                            ...formData.participants,
                            value as Participant,
                          ]);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Participants"
                          margin="dense"
                        />
                      )}
                    />

                    {/* Selected Participants Table */}
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                      <Table size="small">
                        <TableBody>
                          {formData.participants.map((participant) => (
                            <TableRow key={participant.id}>
                              <TableCell>{participant.name}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </DialogContent>

              {/* Dialog Actions */}
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
              open={confirmationDialog}
              onClose={() => setConfirmationDialog(false)}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogContent>
                <Typography>
                  Your project will be sent to the jury. Do you want to submit
                  now?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setConfirmationDialog(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button onClick={() => handleConfirmation()} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color="primary">
                  Cancel
                </Button>
                <Button color="error" onClick={() => handleDelete()}>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default BuildProjectPage;

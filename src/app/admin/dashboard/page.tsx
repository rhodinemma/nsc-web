"use client";
import AdminNavbar from "@/components/AdminNav";
import {
  AssignmentTurnedIn,
  Close,
  Download,
  FileOpen,
  Grid4x4,
  HourglassDisabled,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import useJuryStore from "@/store/projectStore";
import { useRouter } from "next/navigation";
import useJuryAuthStore from "@/store/juryStore";

interface Assessor {
  _id: string;
  name: string;
  email: string;
}

interface AssignedAssessor {
  _id: string;
  name: string;
  email: string;
}

interface Participant {
  name: string;
}

interface ProjectData {
  _id?: string;
  title: string;
  subTheme: string;
  participantType: string;
  participant?: string;
  participants?: Participant[];
  description: string;
  file?: string;
  createdAt?: Date;
  updatedAt?: string;
  finalScore?: string;
}

interface Criterion {
  _id: string;
  criterion: string;
  score: number;
}

interface Submission {
  _id: string;
  juryId: string;
  projectId: string;
  criteria: Criterion[];
  totalScore: number;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProjectScoreType {
  _id: string;
  averageScore: number;
  submissions: Submission[];
}

const JuryDashboardPage = () => {
  const router = useRouter();

  // for submission to backend
  const juryName = useJuryAuthStore((state) => state.juryName);
  const juryEmail = useJuryAuthStore((state) => state.juryEmail);
  const juryRole = useJuryAuthStore((state) => state.juryRole);
  const juryId = useJuryAuthStore((state) => state.juryId);
  const setJuryProject = useJuryStore((state) => state.setJuryProject);

  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [selectedAssessor, setSelectedAssessor] = useState<Assessor | null>(
    null
  );
  const [assignedAssessors, setAssignedAssessors] = useState<
    AssignedAssessor[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [reviewProject, setReviewProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [checkSubmission, setCheckSubmission] = useState<
    Record<string, boolean>
  >({});

  const [projectScore, setProjectScore] = useState<ProjectScoreType | null>(
    null
  );

  // Fetch all assessors
  useEffect(() => {
    const fetchAssessors = async () => {
      try {
        const response = await axios.get<{ status: string; data: Assessor[] }>(
          "http://localhost:3002/api/v1/identities"
        );
        setAssessors(response.data.data);
      } catch (error) {
        console.error("Error fetching assessors:", error);
      }
    };

    fetchAssessors();
  }, []);

  // Assign an assessor to the project
  const handleAssign = async (projectId: string) => {
    if (!selectedAssessor) return;

    const data = {
      projectId,
      juryId: selectedAssessor._id,
    };

    try {
      await axios.post(
        "http://localhost:3002/api/v1/identities/assign-project",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAssignedAssessors((prev) => [...prev, selectedAssessor]);
      setSelectedAssessor(null);
      toast.success("Assigned project successfully!");
    } catch (error) {
      console.error("Error assigning assessor:", error);
    }
  };

  // Remove an assessor from the project
  const handleRemove = async (projectId: string, juryId: string) => {
    const data = {
      projectId,
      juryId,
    };

    try {
      await axios.post(
        "http://localhost:3002/api/v1/identities/remove-project",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAssignedAssessors((prev) =>
        prev.filter((assessor) => assessor._id !== juryId)
      );
      toast.success("Removed from project successfully!");
    } catch (error) {
      console.error("Error removing assessor:", error);
    }
  };

  // useEffect(() => {

  //   fetchAssignedAssessors();
  // }, [projectId]);

  useEffect(() => {
    setLoading(true);
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/v1/identities/${juryId}/projects?role=${juryRole}`
        );

        setProjects(response.data.data.projects);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to get all projects:", error);
      }
    };

    fetchAllProjects();
  }, [juryId, juryRole]);

  const fetchSubmissionStatus = async (projectId: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/v1/identities/check-submission/${juryId}/${projectId}`
      );
      return response.data.hasSubmitted; // Assuming the API returns `true` or `false`
    } catch (error) {
      console.error("Error fetching submission status:", error);
      return false; // Default to false if there is an error
    }
  };

  useEffect(() => {
    const fetchAllStatuses = async () => {
      const statuses: Record<string, boolean> = {};
      for (const project of projects) {
        if (project._id) {
          const status = await fetchSubmissionStatus(project._id);
          statuses[project._id] = status;
        }
      }
      setCheckSubmission(statuses);
    };

    fetchAllStatuses();
  }, [projects, juryId]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getProjectScores = async (projectId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/v1/identities/projects/${projectId}`
      );

      setProjectScore(response.data.data);
    } catch (error) {
      console.error("Failed to get all projects:", error);
    }
  };

  const fetchAssignedAssessors = async (projectId: string) => {
    try {
      const response = await axios.get<{
        status: string;
        data: AssignedAssessor[];
      }>(`http://localhost:3002/api/v1/identities/check-jury/${projectId}`);
      setAssignedAssessors(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned assessors:", error);
    }
  };

  const handleReviewProject = (project: ProjectData) => {
    setReviewProject(project);

    fetchAssignedAssessors(project?._id ?? "");

    getProjectScores(project?._id ?? "");

    setOpenReviewDialog(true);
  };

  const handleCloseReviewProject = () => {
    setReviewProject(null);
    setOpenReviewDialog(false);
  };

  const handleAssessProject = (project: ProjectData) => {
    setJuryProject({
      _id: project?._id ?? "",
      title: project?.title,
      subTheme: project?.subTheme,
      description: project?.description,
    });

    // redirect to review page
    router.push("/admin/dashboard/review");
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/v1/uploads/view/${fileId}`
      );
      if (!response.ok) {
        toast.error("Issue detected downloading project file!");
        throw new Error("Download failed");
      }

      // Convert the response to a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}-NSC2025.sb3`;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading project file!");
    }
  };

  const calculateAverageScore = (
    criteria: { criterion: string; score: number }[]
  ) => {
    const total = criteria.reduce((sum, item) => sum + item.score, 0);
    return total;
  };

  console.log("length", projectScore?.submissions.length);

  return (
    <>
      <AdminNavbar />

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
          sx={{ margin: "2rem 0 2rem 0" }}
        >
          Participant projects
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
            {/* <Typography variant="h5">All projects</Typography> */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5">All projects</Typography>
              <Chip size="small" label={projects?.length} color="primary" />
            </Box>
            {juryRole === "Admin" && (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                  startIcon={<Grid4x4 />}
                >
                  Open score sheet
                </Button>
              </Box>
            )}
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
            ) : (
              !loading &&
              projects?.length > 0 &&
              projects?.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} mb={3} key={index}>
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
                      {toSentenceCase(project.title)}
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
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 4,
                      }}
                    >
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        startIcon={<FileOpen />}
                        onClick={() => handleReviewProject(project)}
                      >
                        Review
                      </Button>

                      {/* Conditionally render "Mark" button */}
                      {!checkSubmission[project._id ?? ""] && (
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          startIcon={<AssignmentTurnedIn />}
                          onClick={() => handleAssessProject(project)}
                        >
                          Mark
                        </Button>
                      )}

                      {/* Conditionally render "Download" button */}
                      {!checkSubmission[project._id ?? ""] && (
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          startIcon={<Download />}
                          onClick={() =>
                            handleDownload(project?.file ?? "", project?.title)
                          }
                        >
                          Download
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {/* Review project dialog */}
          <Dialog
            open={openReviewDialog}
            onClose={handleCloseReviewProject}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {toSentenceCase(reviewProject?.title ?? "")}
                </Typography>
                <IconButton onClick={handleCloseReviewProject} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sub Theme
                  </Typography>
                  <Typography>{reviewProject?.subTheme}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography>{reviewProject?.description}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Participant type
                  </Typography>
                  <Typography>{reviewProject?.participantType}</Typography>
                </Box>

                {reviewProject?.participants &&
                  reviewProject.participants.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Team members
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {reviewProject?.participants.map((participant) => (
                          <Chip
                            key={participant}
                            label={participant}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Submitter email
                  </Typography>
                  <Typography>{reviewProject?.participant}</Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Submitted on
                      </Typography>
                      <Typography>
                        {format(
                          new Date(reviewProject?.createdAt ?? new Date()),
                          "PPP"
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  {juryRole === "Admin" && (
                    <>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Assigned Jury
                      </Typography>

                      <Autocomplete
                        options={assessors}
                        getOptionLabel={(option) =>
                          `${option.name} (${option.email})`
                        }
                        value={selectedAssessor}
                        onChange={(event, newValue) =>
                          setSelectedAssessor(newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Jury"
                            variant="outlined"
                          />
                        )}
                        sx={{ mb: 2, width: "100%", maxWidth: 400 }}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAssign(reviewProject?._id ?? "")}
                        disabled={!selectedAssessor}
                      >
                        Assign jury
                      </Button>

                      <TableContainer style={{ marginBottom: "24px" }}>
                        {/* Table of Assigned Assessors */}
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {assignedAssessors.length > 0
                              ? assignedAssessors.map((assessor) => (
                                  <TableRow key={assessor._id}>
                                    <TableCell>{assessor.name}</TableCell>
                                    <TableCell>{assessor.email}</TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() =>
                                          handleRemove(
                                            reviewProject?._id ?? "",
                                            assessor._id
                                          )
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              : null}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {assignedAssessors.length === 0 && (
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          height="20vh"
                          sx={{
                            bgcolor: "whitesmoke",
                            color: "#7d7d7d",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <HourglassDisabled style={{ fontSize: 20 }} />
                          <Typography variant="body1">
                            No jury assigned yet!
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* Table 2: Submitted Scoring Criteria */}
                  {/* {juryRole === "Jury" && (
                    <> */}
                  <Typography variant="h6" gutterBottom>
                    Scores
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Criteria</TableCell>
                          <TableCell>Scores</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projectScore &&
                          projectScore.submissions.map((submission, index) => (
                            <TableRow key={index}>
                              <TableCell>{juryName}</TableCell>
                              <TableCell>{juryEmail}</TableCell>
                              <TableCell>
                                <ul>
                                  {submission.criteria.map((item, i) => (
                                    <li key={i}>
                                      {item.criterion}: {item.score}/10
                                    </li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell>
                                {calculateAverageScore(submission.criteria)}
                                /50
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {projectScore?.submissions.length === undefined && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      height="20vh"
                      sx={{
                        bgcolor: "whitesmoke",
                        color: "#7d7d7d",
                        borderRadius: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      <HourglassDisabled style={{ fontSize: 20 }} />
                      <Typography variant="body1">
                        No scores submitted yet!
                      </Typography>
                    </Box>
                  )}
                  {/* </>
                  )} */}
                </Box>
              </Stack>
            </DialogContent>
          </Dialog>

          {/* Marked project dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>
              {" "}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">All projects score sheet</Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* <Table style={{ border: "1px solid black" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold", border: "1px solid black" }}
                    >
                      Project Title
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", border: "1px solid black" }}
                    >
                      Subtheme
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", border: "1px solid black" }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", border: "1px solid black" }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", border: "1px solid black" }}
                    >
                      Participant Info
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", border: "1px solid black" }}
                    >
                      Final Score
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[].map((project, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project?.title}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project?.subTheme}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project?.description}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project?.participantType}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project?.participantType === "Team" ? (
                          project?.participants &&
                          project?.participants.map((participant, index) => (
                            <Chip
                              key={index} // Use the index or a unique identifier for the participant as the key
                              label={participant}
                              size="small"
                              variant="outlined"
                              style={{ margin: "2px" }} // Add spacing between Chips
                            />
                          ))
                        ) : (
                          <Chip
                            label={project.participant}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {project.finalScore}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </DialogContent>
            {/* Dialog Actions */}
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default JuryDashboardPage;

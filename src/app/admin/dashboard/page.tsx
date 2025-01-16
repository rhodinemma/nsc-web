"use client";
import AdminNavbar from "@/components/AdminNav";
import {
  AssignmentTurnedIn,
  Close,
  Delete,
  Download,
  FileOpen,
  Grid4x4,
} from "@mui/icons-material";
import {
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import useJuryStore from "@/store/projectStore";
import { useRouter } from "next/navigation";
import useJuryAuthStore from "@/store/juryStore";

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

  const dummyProjectData: ProjectData[] = [
    {
      title: "Clean Energy Initiative",
      subTheme: "Sustainability and GreenTech",
      description: "A project focused on renewable energy solutions.",
      participantType: "Individual",
      participant: "Nagwere Rhodin Emmanuel",
      finalScore: "63/75",
    },
    {
      title: "Digital Learning Platform",
      subTheme: "Digital Education",
      description: "An interactive platform for online education.",
      participantType: "Team",
      participants: [
        "Wanyenya Pretty Phemia",
        "Nabuti George William",
        "Ntambi Nessim",
        "Wandera Phillip",
      ],
      finalScore: "53/75",
    },
  ];

  // Dummy data for submitted scores
  const submittedScores = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      criteria: [
        { criterion: "Creativity and Innovation", score: 8 },
        { criterion: "Technical Proficiency", score: 7 },
        { criterion: "Relevance to Theme", score: 9 },
        { criterion: "Impact and Engagement", score: 10 },
        { criterion: "Presentation and Usability", score: 8 },
      ],
    },
  ];

  const [allAssessors, setAllAssessors] = useState([
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Alice Brown", email: "alice.brown@example.com" },
    { name: "Bob Johnson", email: "bob.johnson@example.com" },
  ]);
  const [selectedAssessors, setSelectedAssessors] = useState<string[]>([]);
  const [selectedAssessor, setSelectedAssessor] = useState("");

  const [loading, setLoading] = useState(false);
  const [reviewProject, setReviewProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);

  const [projectScore, setProjectScore] = useState<ProjectScoreType | null>(
    null
  );

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

  const handleReviewProject = (project: ProjectData) => {
    setReviewProject(project);

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
        `https://progressbot-vzd5.onrender.com/api/v1/uploads/view/${fileId}`
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

  const handleAssignAssessor = () => {
    if (
      selectedAssessor &&
      !selectedAssessors.includes(selectedAssessor) &&
      selectedAssessors.length < 3
    ) {
      setSelectedAssessors([...selectedAssessors, selectedAssessor]);
    }
    setSelectedAssessor("");
  };

  const calculateAverageScore = (
    criteria: { criterion: string; score: number }[]
  ) => {
    const total = criteria.reduce((sum, item) => sum + item.score, 0);
    return total;
  };

  const handleRemoveAssessor = (email: string) => {
    const updatedList = allAssessors.filter(
      (assessor) => assessor.email !== email
    );
    setAllAssessors(updatedList);
  };

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
              <Chip size="small" label={projects.length} color="primary" />
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

                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        startIcon={<AssignmentTurnedIn />}
                        onClick={() => handleAssessProject(project)}
                      >
                        Mark
                      </Button>

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
                      <Typography variant="subtitle2" color="text.secondary">
                        Assigned Jury
                      </Typography>

                      <FormControl fullWidth margin="normal">
                        <InputLabel id="assessor-select-label">
                          Select Assessor
                        </InputLabel>
                        <Select
                          labelId="assessor-select-label"
                          value={selectedAssessor}
                          onChange={(e) => setSelectedAssessor(e.target.value)}
                        >
                          {allAssessors
                            .filter(
                              (assessor) =>
                                !selectedAssessors.includes(assessor.name)
                            )
                            .map((assessor) => (
                              <MenuItem
                                key={assessor.email}
                                value={assessor.name}
                              >
                                {assessor.name} ({assessor.email})
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAssignAssessor}
                        disabled={
                          !selectedAssessor || selectedAssessors.length >= 3
                        }
                      >
                        Assign Assessor
                      </Button>

                      <TableContainer style={{ marginBottom: "24px" }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  border: "1px solid black",
                                }}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  border: "1px solid black",
                                }}
                              >
                                Email
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  border: "1px solid black",
                                }}
                              >
                                Manage
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allAssessors.map((assessor, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  style={{
                                    border: "1px solid black",
                                  }}
                                >
                                  {assessor.name}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid black",
                                  }}
                                >
                                  {assessor.email}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid black",
                                  }}
                                >
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleRemoveAssessor(assessor.email)
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}

                  {/* Table 2: Submitted Scoring Criteria */}
                  <Typography variant="h6" gutterBottom>
                    Submitted scores
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              fontWeight: "bold",
                              border: "1px solid black",
                            }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            style={{
                              fontWeight: "bold",
                              border: "1px solid black",
                            }}
                          >
                            Email
                          </TableCell>
                          <TableCell
                            style={{
                              fontWeight: "bold",
                              border: "1px solid black",
                            }}
                          >
                            Criteria
                          </TableCell>
                          <TableCell
                            style={{
                              fontWeight: "bold",
                              border: "1px solid black",
                            }}
                          >
                            Scores
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projectScore &&
                          projectScore.submissions.map((submission, index) => (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  border: "1px solid black",
                                }}
                              >
                                {juryName}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid black",
                                }}
                              >
                                {juryEmail}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid black",
                                }}
                              >
                                <ul>
                                  {submission.criteria.map((item, i) => (
                                    <li key={i}>
                                      {item.criterion}: {item.score}/10
                                    </li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid black",
                                }}
                              >
                                {calculateAverageScore(submission.criteria)}/50
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
              <Table style={{ border: "1px solid black" }}>
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
                  {dummyProjectData.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project.title}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project.subTheme}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project.description}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project.participantType}
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {project.participantType === "Team" ? (
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
              </Table>
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

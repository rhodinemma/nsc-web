/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AdminNavbar from "@/components/AdminNav";
import {
  AssignmentTurnedIn,
  Close,
  Download,
  FileOpen,
  Grid4x4,
  HourglassDisabled,
  Message,
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
import React, { useCallback, useEffect, useState } from "react";
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

interface ParticipantList {
  id: number;
  name: string;
  email: string;
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

interface Jury {
  name: string;
  email: string;
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
  jury?: Jury[];
}

// interface ProjectScoreType {
//   _id: string;
//   averageScore: number;
//   submissions: Submission[];
// }

interface AdminProjectData {
  // _id: string;
  averageScore: number;
  submissions: Submission[];
  project: ProjectData;
}

interface Challenge {
  challengeId: string;
  averageScore: string; // Stored as "X / Y"
  completionPercentage: number;
}

interface ChallengeScore {
  name: string;
  email: string;
  challenges: Challenge[];
}

const JuryDashboardPage = () => {
  const router = useRouter();

  // for submission to backend
  // const juryName = useJuryAuthStore((state) => state.juryName);
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
  const [juryDetails, setJuryDetails] = useState<Jury | null>(null);

  const [loading, setLoading] = useState(false);
  const [reviewProject, setReviewProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [resultsProject, setResultsProject] = useState<AdminProjectData | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [scoreValue, setScoreValue] = useState(0);
  const [participantEmails, setParticipantEmails] = useState<ParticipantList[]>(
    []
  );
  const [challengeScores, setChallengeScores] = useState<ChallengeScore[]>([]);
  const [openSendResultsDialog, setOpenSendResultsDialog] = useState(false);
  const [checkSubmission, setCheckSubmission] = useState<
    Record<string, boolean>
  >({});

  const [projectScore, setProjectScore] = useState<Submission | null>(null);
  const [adminScoreReview, setAdminScoreReview] = useState<Submission[] | null>(
    null
  );
  const [adminProjectScore, setAdminProjectScore] = useState<
    AdminProjectData[] | null
  >(null);

  // const [score1, setScore1] = useState<number | "">("");
  // const [score2, setScore2] = useState<number | "">("");
  // const [overallScore, setOverallScore] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const calculateOverallScore = (score1: any, score2: any) => {
  //   // if (score1 === "" || score2 === "") return;

  //   // Convert scores to percentage if they are not out of 100
  //   const normalizedScore1 = Number(score1) * 100;
  //   const normalizedScore2 = Number(score2) * 100;

  //   // Compute overall weighted score
  //   const overall = normalizedScore1 * 0.7 + normalizedScore2 * 0.3;
  //   setOverallScore(overall);
  // };

  // console.log("overall score", overallScore);

  // Fetch all assessors
  useEffect(() => {
    const fetchAssessors = async () => {
      try {
        const response = await axios.get<{ status: string; data: Assessor[] }>(
          "https://progressbot-vzd5.onrender.com/api/v1/identities"
        );
        setAssessors(response.data.data);
      } catch (error) {
        console.error("Error fetching assessors:", error);
      }
    };

    fetchAssessors();
  }, []);

  const [availableParticipants, setAvailableParticipants] = useState<
    ParticipantList[]
  >([]);

  // useEffect(() => {
  //   const fetchParticipants = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://api.nationalscratchcompetition.org/api/users?page=1&paginator=100",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );

  //       const participants = response.data.data.data.map(
  //         (user: ParticipantList) => ({
  //           id: user.id,
  //           name: user.name,
  //           email: user.email,
  //         })
  //       );
  //       setAvailableParticipants(participants);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching participants:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchParticipants();
  // }, []);

  const fetchParticipants = useCallback(async () => {
    try {
      const authResponse = await axios.post(
        "https://api.nationalscratchcompetition.org/api/login",
        {
          username: "rhodinemma10@gmail.com",
          password: "MpJfWC2P06la",
        }
      );

      const response = await axios.get(
        "https://api.nationalscratchcompetition.org/api/users?page=1&paginator=100",
        {
          headers: {
            Authorization: `Bearer ${authResponse.data?.access_token}`,
          },
        }
      );

      const participants = response.data.data.data.map(
        (user: ParticipantList) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        })
      );
      setAvailableParticipants(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  }, []);

  const fetchParticipantChallengeScores = useCallback(
    async (participants: any) => {
      try {
        let participantList: string[] = [];

        if (Array.isArray(participants)) {
          participantList = participants;
        } else if (typeof participants === "string") {
          const foundParticipant = availableParticipants.filter(
            (participant) => participant.email === participants
          );

          participantList.push(foundParticipant[0].email);
        } else {
          console.warn("Unexpected participants type:", participants);
        }

        const response = await axios.post(
          "https://progressbot-vzd5.onrender.com/api/v1/participant/progress",
          {
            names: participantList,
          }
        );

        console.log(response.data);
        setChallengeScores(response.data);
      } catch (error) {
        console.error("Error fetching participant challenge scores:", error);
      }
    },
    [availableParticipants]
  );

  // Assign an assessor to the project
  const handleAssign = async (projectId: string) => {
    if (!selectedAssessor) return;

    const data = {
      projectId,
      juryId: selectedAssessor._id,
    };

    try {
      await axios.post(
        "https://progressbot-vzd5.onrender.com/api/v1/identities/assign-project",
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
        "https://progressbot-vzd5.onrender.com/api/v1/identities/remove-project",
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

  useEffect(() => {
    setLoading(true);
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get(
          `https://progressbot-vzd5.onrender.com/api/v1/identities/${juryId}/projects?role=${juryRole}`
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

  const fetchSubmissionStatus = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const response = await axios.get(
          `https://progressbot-vzd5.onrender.com/api/v1/identities/check-submission/${juryId}/${projectId}`
        );
        return response.data.hasSubmitted; // Assuming the API returns `true` or `false`
      } catch (error) {
        console.error("Error fetching submission status:", error);
        return false; // Default to false if there is an error
      }
    },
    [juryId]
  );

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
  }, [projects, juryId, fetchSubmissionStatus]);

  const getAllProjectScores = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://progressbot-vzd5.onrender.com/api/v1/identities/project-scores`
      );
      setAdminProjectScore(response.data.data);
      console.log("Project scores fetched:", response.data.data);
    } catch (error) {
      console.error("Failed to get all projects:", error);
    }
  }, []);

  // const handleOpenDialog = () => {
  //   // fetch all scores here
  //   getAllProjectScores();
  //   setOpenDialog(true);
  // };

  const handleOpenDialog = useCallback(() => {
    // Call the API to fetch scores
    getAllProjectScores();
    setOpenDialog(true);
  }, [getAllProjectScores]);

  const handleCloseDialog = () => setOpenDialog(false);

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // const findMatchingJuryMember = (
  //   submissions: Submission[],
  //   email: string
  // ): { submission: Submission; jury: Jury } | null => {
  //   const submission = submissions.find(
  //     (submission) => submission.juryId === juryId
  //   );

  //   console.log("submission", submission);

  //   if (submission && submission.jury && Array.isArray(submission.jury)) {
  //     // Find the jury member within the matched submission
  //     const jury = submission.jury.find(
  //       (juryMember) => juryMember.email === email
  //     );

  //     if (jury) {
  //       return { submission, jury };
  //     }
  //   }
  //   return null;
  // };

  const findMatchingJuryMember = useCallback(
    (
      submissions: Submission[],
      email: string
    ): { submission: Submission; jury: Jury } | null => {
      const submission = submissions.find(
        (submission) => submission.juryId === juryId
      );

      console.log("submission", submission);

      if (submission && submission.jury && Array.isArray(submission.jury)) {
        // Find the jury member within the matched submission
        const jury = submission.jury.find(
          (juryMember) => juryMember.email === email
        );

        if (jury) {
          return { submission, jury };
        }
      }
      return null;
    },
    [juryId]
  );

  const getProjectScores = useCallback(
    async (projectId: string) => {
      try {
        const response = await axios.get(
          `https://progressbot-vzd5.onrender.com/api/v1/identities/projects/${projectId}`
        );
        if (juryRole === "Admin") {
          setAdminScoreReview(response.data.data.submissions);
        }

        const result = findMatchingJuryMember(
          response.data.data.submissions,
          juryEmail
        );

        if (result !== null) {
          console.log("exists", result?.jury);
          setJuryDetails(result?.jury ?? null);
          setProjectScore(result?.submission ?? null);
        }

        return null;
      } catch (error) {
        console.error("Failed to get all projects:", error);
      }
    },
    [findMatchingJuryMember, juryEmail, juryRole]
  );

  const fetchAssignedAssessors = useCallback(async (projectId: string) => {
    try {
      const response = await axios.get<{
        status: string;
        data: AssignedAssessor[];
      }>(
        `https://progressbot-vzd5.onrender.com/api/v1/identities/check-jury/${projectId}`
      );
      setAssignedAssessors(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned assessors:", error);
    }
  }, []);

  const handleReviewProject = (project: ProjectData) => {
    setReviewProject(project);

    fetchAssignedAssessors(project?._id ?? "");

    // Clear previous state before fetching
    setAdminScoreReview([]);
    setProjectScore(null);

    getProjectScores(project?._id ?? "");

    setOpenReviewDialog(true);
  };

  const handleSendResults = (project: AdminProjectData) => {
    fetchParticipants();
    fetchParticipantChallengeScores(
      project?.project?.participants &&
        project?.project?.participants?.length > 0
        ? project?.project?.participants
        : project?.project?.participant
    );
    setResultsProject(project);
    setScoreValue(project.averageScore);
    setOpenSendResultsDialog(true);
  };

  const handleCloseSendResultsDialog = () => {
    setResultsProject(null);
    setChallengeScores([]);
    setOpenSendResultsDialog(false);
  };

  const handleCloseReviewProject = () => {
    setReviewProject(null);
    setAdminProjectScore([]);
    setProjectScore(null);
    setAssignedAssessors([]);
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

  const calculateAverageScore = (
    criteria: { criterion: string; score: number }[]
  ) => {
    const total = criteria.reduce((sum, item) => sum + item.score, 0);
    return total;
  };

  const truncateText = (
    text: string,
    maxLines: number,
    charsPerLine: number = 50
  ) => {
    if (!text) return "";

    const maxLength = maxLines * charsPerLine; // Approximate max characters
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleSubmitResults = async () => {
    console.log("parts", participantEmails);
    console.log("message", message);
    console.log("score", scoreValue);

    try {
      await axios.post(
        "https://progressbot-vzd5.onrender.com/api/v1/identities/send-results",
        {
          participants: participantEmails,
          score: scoreValue,
          message: message,
        }
      );

      toast.success("Results sent successfully!");

      setOpenSendResultsDialog(false);
      setMessage("");
    } catch (err) {
      toast.error("Failed to login!");
      console.error("Error during login:", err);
    }
  };

  // const getProjectScore = (projectScore: any, getTotal?: boolean) => {
  //   console.log("lolest", projectScore?.averageScore);
  //   const averageScore = Math.round(projectScore?.averageScore ?? 0);
  //   const weightedScore = (averageScore / 50) * 100;

  //   if (getTotal) return weightedScore;

  //   // return weightedScore.toFixed(0);
  //   return Number(weightedScore.toFixed(0));
  // };

  // const getChallengeScore = (challengeScore: any, getTotal?: boolean) => {
  //   // Ensure challengeScore is a valid array
  //   if (!Array.isArray(challengeScore) || challengeScore.length === 0) {
  //     return 0; // Return a default value
  //   }

  //   // Ensure averageScore exists and is in the expected format
  //   if (!challengeScore[0]?.averageScore?.includes(" / ")) {
  //     toast.error("Invalid averageScore format!");
  //     return 0;
  //   }

  //   // Extract numerator and denominator safely
  //   const [numerator, denominator] = challengeScore[0].averageScore
  //     .split(" / ")
  //     .map(Number);

  //   if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
  //     toast.error("Invalid score values!");
  //     return 0;
  //   }

  //   if (getTotal) return (numerator / (denominator * 10)) * 100;

  //   const result = (numerator / (denominator * 10)) * 100;
  //   return result;
  // };

  // const getTotalScore = (projectScore: any, challengeScore: any) => {
  //   const project = Number(getProjectScore(projectScore)) || 0;

  //   const challenge = getChallengeScore(challengeScore, true) || 0;

  //   console.log(`project: ${project * 0.7} + challenge: ${challenge * 0.3}`);

  //   return (project * 0.7 + challenge * 0.3).toFixed(0);
  // };

  const getProjectScore = useCallback(
    (projectScore: any, getTotal?: boolean) => {
      console.log("lolest", projectScore?.averageScore);
      const averageScore = Math.round(projectScore?.averageScore ?? 0);
      const weightedScore = (averageScore / 50) * 100;

      if (getTotal) return weightedScore;

      return Number(weightedScore.toFixed(0));
    },
    []
  );

  const getChallengeScore = useCallback(
    (challengeScore: any, getTotal?: boolean) => {
      if (!Array.isArray(challengeScore) || challengeScore.length === 0) {
        return 0;
      }

      if (!challengeScore[0]?.averageScore?.includes(" / ")) {
        toast.error("Invalid averageScore format!");
        return 0;
      }

      const [numerator, denominator] = challengeScore[0].averageScore
        .split(" / ")
        .map(Number);

      if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        toast.error("Invalid score values!");
        return 0;
      }

      const result = (numerator / (denominator * 10)) * 100;
      return getTotal ? result : result;
    },
    []
  );

  const getTotalScore = useCallback(
    (projectScore: any, challengeScore: any) => {
      const project = Number(getProjectScore(projectScore)) || 0;
      const challenge = getChallengeScore(challengeScore, true) || 0;

      console.log(`project: ${project * 0.7} + challenge: ${challenge * 0.3}`);

      return (project * 0.7 + challenge * 0.3).toFixed(0);
    },
    [getProjectScore, getChallengeScore]
  );

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
                        fontSize: "0.7rem",
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
                        // WebkitBoxOrient: "vertical",
                        // overflow: "hidden",
                        WebkitLineClamp: 1,
                        textOverflow: "ellipsis",
                        textAlign: "left",
                        width: "100%",
                        marginBottom: 4, // Space for buttons
                      }}
                    >
                      {truncateText(project.description, 1)}
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

            {!loading && projects.length === 0 && (
              <Container disableGutters>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="50vh"
                  sx={{
                    bgcolor: "whitesmoke",
                    color: "#7d7d7d",
                    borderRadius: "1rem",
                    marginTop: "2rem",
                    marginBottom: "2rem",
                    marginLeft: "1rem",
                  }}
                >
                  <HourglassDisabled style={{ fontSize: 50 }} />
                  <Typography variant="h5">
                    No projects assigned yet!
                  </Typography>
                </Box>
              </Container>
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
                        {reviewProject?.participants.map(
                          (participant, index) => (
                            <Chip
                              key={index}
                              // label={participant}
                              label={participant as unknown as string}
                              size="small"
                              variant="outlined"
                            />
                          )
                        )}
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
                        {juryRole === "Admin" ? (
                          adminScoreReview &&
                          adminScoreReview?.map(
                            (submission: Submission, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {submission?.jury && submission?.jury[0].name}
                                </TableCell>
                                <TableCell>
                                  {submission?.jury &&
                                    submission?.jury[0].email}
                                </TableCell>
                                <TableCell>
                                  <ul>
                                    {submission.criteria.map(
                                      (item: Criterion, i: number) => (
                                        <li key={i}>
                                          {item.criterion}: {item.score}/10
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </TableCell>
                                <TableCell>
                                  {calculateAverageScore(submission.criteria)}
                                  /50
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : juryDetails?.email === juryEmail && projectScore ? (
                          <TableRow>
                            <TableCell>{juryDetails?.name}</TableCell>
                            <TableCell>{juryDetails?.email}</TableCell>
                            <TableCell>
                              <ul>
                                {projectScore.criteria.map((item, i) => (
                                  <li key={i}>
                                    {item.criterion}: {item.score}/10
                                  </li>
                                ))}
                              </ul>
                            </TableCell>
                            <TableCell>
                              {calculateAverageScore(projectScore.criteria)}
                              /50
                            </TableCell>
                          </TableRow>
                        ) : adminProjectScore?.length === 0 &&
                          projectScore === null ? (
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
                        ) : (
                          // adminScoreReview?.length === 0 && (
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
                          // )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* {adminProjectScore === null && projectScore === null && (
                    
                  )} */}
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
            maxWidth="xl"
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  NSC final score sheet ({adminProjectScore?.length} marked
                  projects)
                </Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>SubTheme</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Participants</TableCell>
                      {/* <TableCell>Average Score</TableCell> */}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminProjectScore?.map((projectData, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {toSentenceCase(projectData.project.title)}
                        </TableCell>
                        <TableCell>{projectData.project.subTheme}</TableCell>
                        <TableCell>
                          {truncateText(projectData.project.description, 3)}
                        </TableCell>
                        <TableCell>
                          {projectData.project.participants &&
                            projectData?.project?.participants.map(
                              (participant, index) => (
                                <Chip
                                  key={index}
                                  label={participant as unknown as string}
                                  variant="outlined"
                                  sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                                />
                              )
                            )}

                          <Chip
                            // key={index}
                            label={
                              `Submitted by: ${projectData?.project?.participant}` as unknown as string
                            }
                            variant="outlined"
                            sx={{
                              marginRight: 0.5,
                              marginBottom: 0.5,
                              borderColor: "green",
                              color: "green",
                            }}
                          />
                        </TableCell>
                        {/* <TableCell>
                          {Math.round(projectData.averageScore)} / 50
                        </TableCell> */}
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleSendResults(projectData)}
                          >
                            View results
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            {/* Dialog Actions */}
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Send results dialog */}
          <Dialog
            open={openSendResultsDialog}
            onClose={handleCloseSendResultsDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              {" "}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {resultsProject?.project.title}
                </Typography>
                <IconButton onClick={handleCloseSendResultsDialog} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                SubTheme: {resultsProject?.project.subTheme}
              </Typography>

              <Box mt={2} mb={3}>
                <Typography variant="body2">
                  {resultsProject?.project.description}
                </Typography>
              </Box>
              {/* <Box>
                <Typography variant="h2" align="center" gutterBottom>
                  {Math.round(resultsProject?.averageScore ?? 0)} / 50
                </Typography>
                <Typography variant="h5" align="center" gutterBottom>
                  ({" "}
                  {Math.round(((resultsProject?.averageScore ?? 0) / 50) * 100)}
                  %)
                </Typography>
              </Box> */}

              {/* Display Participants in Chips */}
              <Box mt={2} mb={3}>
                <Typography variant="h6" gutterBottom>
                  Participants:
                </Typography>
                <Grid container spacing={1}>
                  {resultsProject?.project?.participants &&
                    resultsProject?.project?.participants.map(
                      (participant, index) => (
                        <Chip
                          key={index}
                          label={participant as unknown as string}
                          variant="outlined"
                          sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                        />
                      )
                    )}

                  <Chip
                    // key={index}
                    label={
                      `Submitted by: ${resultsProject?.project?.participant}` as unknown as string
                    }
                    variant="outlined"
                    sx={{
                      marginRight: 0.5,
                      marginBottom: 0.5,
                      borderColor: "green",
                      color: "green",
                    }}
                  />
                </Grid>
              </Box>

              <Typography variant="h6" gutterBottom>
                Indiviudal score breakdown:
              </Typography>

              <TableContainer sx={{ paddingBottom: "1rem" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Challenges</TableCell>
                      <TableCell>Overall Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {challengeScores && challengeScores.length > 0 ? (
                      challengeScores?.map(
                        (challengeScore: ChallengeScore, index) => (
                          <TableRow key={index}>
                            <TableCell>{challengeScore.name}</TableCell>
                            <TableCell>
                              {getProjectScore(resultsProject)}%
                            </TableCell>
                            <TableCell>
                              {getChallengeScore(
                                challengeScore.challenges.filter(
                                  (challenge) =>
                                    challenge.challengeId ===
                                    "672d1513bc573ddbaf73b560"
                                )
                              )}
                              %
                            </TableCell>

                            <TableCell>
                              {getTotalScore(
                                resultsProject,
                                challengeScore.challenges.filter(
                                  (challenge) =>
                                    challenge.challengeId ===
                                    "672d1513bc573ddbaf73b560"
                                )
                              )}{" "}
                              %
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : resultsProject?.project?.participants &&
                      resultsProject?.project?.participants.length > 0 ? (
                      resultsProject?.project?.participants.map(
                        (participant, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {participant as unknown as string}
                            </TableCell>
                            <TableCell>
                              {(getProjectScore(resultsProject) * 0.7).toFixed(
                                0
                              )}
                              %
                            </TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>
                              {(getProjectScore(resultsProject) * 0.7).toFixed(
                                0
                              )}
                              %
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell>
                          {
                            resultsProject?.project
                              ?.participant as unknown as string
                          }
                        </TableCell>
                        <TableCell>
                          {(getProjectScore(resultsProject) * 0.7).toFixed(0)}%
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>
                          {(getProjectScore(resultsProject) * 0.7).toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="body1">
                Send results to the following
              </Typography>
              <Autocomplete
                multiple
                options={availableParticipants}
                getOptionLabel={(option: ParticipantList) => option.email}
                onChange={(e, value) => {
                  console.log("va", value);
                  const emails = value.map((participant) => participant.email);
                  console.log("emails", emails);
                  setParticipantEmails(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Participants"
                    margin="dense"
                  />
                )}
              />
              {/* 
              <Box mt={3}>
                <Typography variant="body1" gutterBottom>
                  Comment to participant(s):
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Box> */}

              <Box mt={2} textAlign="right">
                <Button
                  startIcon={<Message />}
                  variant="contained"
                  color="primary"
                  disabled={true}
                  onClick={handleSubmitResults}
                >
                  Send results
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default JuryDashboardPage;

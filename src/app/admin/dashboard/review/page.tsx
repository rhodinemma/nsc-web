"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { Checklist, Close, Info } from "@mui/icons-material";
import AdminNavbar from "@/components/AdminNav";
import useJuryStore from "@/store/projectStore";
import axios from "axios";
import useJuryAuthStore from "@/store/juryStore";
import { toast } from "sonner";

function AssessProjectPage() {
  const project = useJuryStore((state) => state.project);
  const juryId = useJuryAuthStore((state) => state.juryId);

  const [openAssessDialog, setOpenAssessDialog] = useState(false);
  const [openInstructionsDialog, setOpenInstructionsDialog] = useState(true);

  // Initialize state for scores with criteria
  const [criteriaScores, setCriteriaScores] = useState([
    { criterion: "Creativity and Innovation", score: 0 },
    { criterion: "Technical Proficiency", score: 0 },
    { criterion: "Relevance to Theme", score: 0 },
    { criterion: "Impact and Engagement", score: 0 },
    { criterion: "Presentation and Usability", score: 0 },
  ]);

  const handleOpenAssessDialog = () => {
    setOpenAssessDialog(true);
  };

  const handleCloseAssessDialog = () => {
    setOpenAssessDialog(false);
  };

  const handleOpenInstructionsDialog = () => {
    setOpenInstructionsDialog(true);
  };

  const handleCloseInstructionsDialog = () => {
    setOpenInstructionsDialog(false);
  };

  // Check if all criteria have been scored
  const isSubmitDisabled = criteriaScores.some((item) => item.score === 0);

  const handleScoreChange = (index: number, value: number) => {
    const updatedCriteriaScores = [...criteriaScores];
    updatedCriteriaScores[index].score = value;
    setCriteriaScores(updatedCriteriaScores);
  };

  const handleSubmit = async () => {
    const data = {
      projectId: project?._id,
      juryId: juryId,
      criteria: criteriaScores,
    };

    try {
      const response = await axios.post(
        `https://progressbot-vzd5.onrender.com/api/v1/identities/mark-project`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Project marks submitted successfully!");

      console.log("Project marks submitted:", response.data);

      handleCloseAssessDialog();
    } catch (error) {
      console.error("Failed to get all projects:", error);
    } finally {
      handleCloseAssessDialog();
    }
  };

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  console.log("project", project);

  return (
    <>
      <AdminNavbar />

      <iframe
        src="https://staging.nationalscratchcompetition.org/"
        width="100%"
        height={700}
      ></iframe>

      <Box
        style={{
          position: "fixed",
          bottom: 80,
          left: 16,
          display: "flex",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenInstructionsDialog}
          startIcon={<Info />}
          size="large"
        >
          View instructions
        </Button>
      </Box>

      <Box
        style={{
          position: "fixed",
          bottom: 20,
          left: 16,
          display: "flex",
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#855dd6",
          }}
          onClick={handleOpenAssessDialog}
          startIcon={<Checklist />}
          size="large"
        >
          Score project
        </Button>
      </Box>

      {/* Instructions Dialog */}
      <Dialog
        open={openInstructionsDialog}
        onClose={handleCloseInstructionsDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Jury Instructions</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Please follow these steps before assessing the project:
          </Typography>
          <ol>
            <li>
              Upload the project file. By clicking on the -File- option in the
              scratch editor menu bar
            </li>
            {/* <li>Review the provided screenshots below for reference.</li> */}
            <li>Understand the scoring criteria detailed below:</li>
          </ol>

          <Typography variant="h6" gutterBottom>
            Scoring Criteria:
          </Typography>
          <ul>
            <li>
              <strong>Creativity and Innovation:</strong> Originality and
              inventiveness of the project.
            </li>
            <li>
              <strong>Technical Proficiency:</strong> Complexity and
              functionality of the project.
            </li>
            <li>
              <strong>Relevance to Theme:</strong> Alignment with the chosen
              sub-theme.
            </li>
            <li>
              <strong>Impact and Engagement:</strong> Ability to engage and
              inspire the audience.
            </li>
            <li>
              <strong>Presentation and Usability:</strong> Clarity and polish of
              the final project.
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructionsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assess Project Dialog */}
      <Dialog
        open={openAssessDialog}
        onClose={handleCloseAssessDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Project: {toSentenceCase(project?.title ?? "")}
            </Typography>
            <IconButton onClick={handleCloseAssessDialog} size="small">
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
              <Typography>{project?.subTheme}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography>{project?.description}</Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              Scoring Criteria
            </Typography>

            {/* {[
              "Creativity and Innovation",
              "Technical Proficiency",
              "Relevance to Theme",
              "Impact and Engagement",
              "Presentation and Usability",
            ].map((criterion, index) => (
              <Box key={index} mb={4}>
                <Typography variant="subtitle1" gutterBottom>
                  {criterion} (0-10 points)
                </Typography>
                <Slider
                  defaultValue={5}
                  step={1}
                  min={0}
                  max={10}
                  marks
                  valueLabelDisplay="on"
                  aria-labelledby={`slider-${index}`}
                />
              </Box>
            ))} */}
            {criteriaScores.map((item, index) => (
              <Box key={index} mb={4}>
                <Typography variant="subtitle1" gutterBottom>
                  {item.criterion} (0-10 points)
                </Typography>
                <Slider
                  defaultValue={5}
                  step={1}
                  min={0}
                  max={10}
                  marks
                  valueLabelDisplay="on"
                  value={item.score || 0}
                  onChange={(e, value) =>
                    handleScoreChange(index, value as number)
                  }
                  aria-labelledby={`slider-${index}`}
                />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssessDialog} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            Submit Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssessProjectPage;

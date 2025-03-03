/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useParticipantStore from "@/store/participantStore";
// import api from "@/api/api";
import axios from "axios";
import ImageCarousel from "@/components/ImageCarousel";
import CongratulationsSection from "@/components/Congs/Congs";

const images = [
  { src: "/1.jpeg", alt: "Poster 1" },
  { src: "/2.jpeg", alt: "Poster 2" },
  { src: "/3.jpeg", alt: "Poster 3" },
];

interface ChallengeDetail {
  challengeId: string;
  name: string;
  totalLevels: number;
  levelsCompleted: number;
  completed: boolean;
}

interface ProgressSummary {
  participant: string;
  completedLevels: number;
  completedChallenges: number;
  challengeDetails: ChallengeDetail[];
}

const ProgressCircle = ({
  value,
  total,
  label,
  color = "primary",
}: {
  value: number;
  total: number;
  label: string;
  color: string;
}) => {
  const theme = useTheme();
  const progress = total > 0 ? (value / total) * 100 : 0;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={120}
          thickness={5}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" component="div" color="text.secondary">
            {value}/{total}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};

// Speedometer component
const Speedometer = ({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label: string;
}) => {
  const theme = useTheme();
  const progress = total > 0 ? (value / total) * 100 : 0;
  const angle = progress * 1.8 - 90; // Convert percentage to angle (180 degrees total, starting from -90)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 160,
          height: 80,
          overflow: "hidden",
        }}
      >
        {/* Gauge background */}
        <Box
          sx={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            bottom: 0,
            background: `conic-gradient(
            ${theme.palette.grey[300]} 0deg,
            ${theme.palette.grey[300]} 180deg,
            transparent 180deg,
            transparent 360deg
          )`,
          }}
        />

        {/* Gauge needle */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: 4,
            height: 70,
            backgroundColor: theme.palette.primary.main,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transition: "transform 0.5s ease-out",
            zIndex: 2,
          }}
        />

        {/* Center point */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: 12,
            height: 12,
            backgroundColor: theme.palette.primary.dark,
            borderRadius: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
          }}
        />

        {/* Value text */}
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            bottom: 15,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          {value}/{total}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  const { username, email } = useParticipantStore();

  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [totalLevels, setTotalLevels] = useState(0);
  const [levelProgress, setLevelProgress] = useState(0);
  const [projects, setProjects] = useState<FormData[]>([]);
  // const [completedProjects, setCompletedProjects] = useState(0);
  // const [totalProjects, setTotalProjects] = useState(0);
  // const [projectProgress, setProjectProgress] = useState(0);

  // const cardStyle = {
  //   position: "relative",
  //   height: "100%",
  //   backgroundImage: 'url("/puzzle.svg")',
  //   backgroundSize: "cover",
  //   backgroundPosition: "40% 60%",
  //   color: "#fff",
  //   overflow: "hidden",
  // };

  useEffect(() => {
    if (email) {
      const fetchProgress = async () => {
        try {
          const { data } = await axios.get<ProgressSummary>(
            `https://pt-updated-c6ed560c-f7ed-437c-b7bb.cranecloud.io/api/v1/progress/dashboard-summary/participant?email=${email}`
          );

          const summary = data;

          // Levels
          const completedLevels = summary.completedLevels || 0;
          const totalLevels = summary.challengeDetails.reduce(
            (total, challenge) => total + challenge.totalLevels,
            0
          );

          setCompletedLevels(completedLevels);
          setTotalLevels(totalLevels);
          setLevelProgress(
            totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0
          );

          // Challenges
          const completedChallenges = summary.completedChallenges || 0;
          const totalChallenges = summary.challengeDetails.length;

          setCompletedChallenges(completedChallenges);
          setTotalChallenges(totalChallenges);
          setChallengeProgress(
            totalChallenges > 0
              ? (completedChallenges / totalChallenges) * 100
              : 0
          );
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      };

      fetchProgress();
    }
  }, [email]);

  useEffect(() => {
    const fetchParticipantProject = async () => {
      try {
        const response = await axios.post(
          `https://progressrounds-4f470cd5-1187-4be1-a866.cranecloud.io/api/v1/project/participant`,
          {
            email: email,
          }
        );

        setProjects(response.data.data);
      } catch (error) {
        console.error("Failed to get projects for participant:", error);
      }
    };

    fetchParticipantProject();
  }, [email]);

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
          backgroundImage: `url('/puzzle.svg')`,
          backgroundRepeat: "repeat",
          backgroundPosition: "cover",
          height: "100vh",
        }}
      >
        <Box sx={{ padding: 4 }}>
          <Grid container spacing={4}>
            {/* Left Section */}
            <Grid item xs={12} md={8} sx={{ position: "relative", zIndex: 2 }}>
              <CongratulationsSection userName={username} />

              <Paper
                elevation={2}
                sx={{
                  mb: 4,
                  backgroundColor: "#f8f9fa",
                  padding: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Your Progress Tracker
                </Typography>

                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={4}>
                    <ProgressCircle
                      value={completedChallenges}
                      total={totalChallenges}
                      label="Challenges Completed"
                      color="primary"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <ProgressCircle
                      value={completedLevels}
                      total={totalLevels}
                      label="Levels Completed"
                      color="secondary"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <ProgressCircle
                      value={projects.length}
                      total={projects.length > 0 ? projects.length : 1}
                      label="Projects Built"
                      color="success"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Section - Announcements */}
            <Grid item xs={12} md={4} sx={{ position: "relative", zIndex: 2 }}>
              {/* <Box
                sx={{ backgroundColor: "#f5f5f5", padding: 3, borderRadius: 2 }}
              > */}
              {/* <Typography
                variant="h5"
                gutterBottom
                sx={{ position: "relative", zIndex: 2, color: "black" }}
              >
                Announcements
              </Typography> */}
              <Box sx={{ position: "relative" }}>
                <ImageCarousel images={images} />
                {/* <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  No announcements found
                </Typography> */}
                {/* {announcements.map((announcement, index) => (
                  <Box key={index} sx={{ mb: 3, position: "relative" }}>
                    
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {announcement.date}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {announcement.text}
                    </Typography>
                    {index < announcements.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))} */}
              </Box>
              {/* </Box> */}
              <Footer />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;

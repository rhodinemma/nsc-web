"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowForwardIos } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useParticipantStore from "@/store/participantStore";
// import api from "@/api/api";
import axios from "axios";
import ImageCarousel from "@/components/ImageCarousel";

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

const Dashboard = () => {
  const { username, email } = useParticipantStore();

  const router = useRouter();

  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [totalLevels, setTotalLevels] = useState(0);
  const [levelProgress, setLevelProgress] = useState(0);
  // const [completedProjects, setCompletedProjects] = useState(0);
  // const [totalProjects, setTotalProjects] = useState(0);
  // const [projectProgress, setProjectProgress] = useState(0);

  const cardStyle = {
    position: "relative",
    height: "100%",
    backgroundImage: 'url("/puzzle.svg")',
    backgroundSize: "cover",
    backgroundPosition: "40% 60%",
    color: "#fff",
    overflow: "hidden",
  };

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

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
          Welcome, {username} !
        </Typography>
        <Grid container spacing={4}>
          {/* Left Section */}
          <Grid item xs={12} md={8}>
            {/* Progress Tracker Section */}
            <Box
              sx={{
                mb: 4,
                backgroundColor: "#f5f5f5",
                padding: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Your Progress Tracker
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Challenges Completed: {completedChallenges} /{" "}
                  {totalChallenges}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={challengeProgress}
                  sx={{ height: 20 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Levels Completed: {completedLevels} / {totalLevels}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={levelProgress}
                  sx={{ height: 20 }}
                />
              </Box>

              <Box>
                <Typography variant="body1">Projects Built: 0 / 0</Typography>
                <LinearProgress
                  variant="determinate"
                  value={0}
                  sx={{ height: 20 }}
                />
              </Box>
            </Box>

            {/* Blockly and Scratch Challenges Section */}
            <Box
              sx={{
                mb: 4,
                backgroundColor: "#f5f5f5",
                padding: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Get Started here
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={cardStyle}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                      }}
                    ></Box>
                    {/* Overlay for blur effect */}
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        onClick={() => router.push("/challenges")}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Blockly Challenges
                        </Typography>
                        <ArrowForwardIos
                          fontSize="small"
                          sx={{ ml: 1, mb: 1 }}
                        />
                      </Box>
                      <Typography variant="body2">
                        Start with exciting Blockly challenges to learn the
                        basics of coding through fun and interactive puzzles!
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={cardStyle}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                      }}
                    ></Box>
                    {/* Overlay for blur effect */}
                    <CardContent sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        onClick={() => router.push("/projects")}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Build a Scratch Project
                        </Typography>
                        <ArrowForwardIos
                          fontSize="small"
                          sx={{ ml: 1, mb: 1 }}
                        />
                      </Box>
                      <Typography variant="body2">
                        Unleash your creativity by building your own projects
                        with Scratch. Design games, animations, and more!
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* <ImageCarousel images={images} /> */}

            {/* <Box sx={{ mt: 4, mb: 4 }}>
              <Box
                sx={{
                  mb: 4,
                  backgroundColor: "#f5f5f5",
                  padding: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  NSC Platform Leaderboard
                </Typography>
                <Grid container spacing={2}>
                  {leaderboardData.map((user, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: 2,
                        }}
                      >
                        <Typography variant="body1">{user.name}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {user.score}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box> */}
          </Grid>

          {/* Right Section - Announcements */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{ backgroundColor: "#f5f5f5", padding: 3, borderRadius: 2 }}
            >
              <Typography variant="h5" gutterBottom>
                Announcements
              </Typography>
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
            </Box>
            <Footer />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;

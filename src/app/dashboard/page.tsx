"use client";
import React from "react";
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

const Dashboard = () => {
  const { username } = useParticipantStore();
  const router = useRouter();
  const cardStyle = {
    position: "relative",
    height: "100%",
    backgroundImage: 'url("/puzzle.svg")',
    backgroundSize: "cover",
    backgroundPosition: "40% 60%",
    color: "#fff",
    overflow: "hidden",
  };

  const completedChallenges = 0;
  const totalChallenges = 20;
  const completedLevels = 0;
  const totalLevels = 5;
  const completedProjects = 0;
  const totalProjects = 5;

  // Calculate progress percentages
  const challengeProgress = (completedChallenges / totalChallenges) * 100;
  const levelProgress = (completedLevels / totalLevels) * 100;
  const projectProgress = (completedProjects / totalProjects) * 100;

  const announcements = [
    {
      date: "November 1, 2024",
      text: "Join our weekly coding challenge for a chance to win fun prizes!",
    },
    {
      date: "October 30, 2024",
      text: "Check out new Scratch tutorials added this week!",
    },
    {
      date: "October 28, 2024",
      text: "Don't forget to complete your coding exercises by Friday.",
    },
  ];

  // const leaderboardData = [
  //   { name: "Alice", score: 95 },
  //   { name: "Bob", score: 90 },
  //   { name: "Charlie", score: 85 },
  //   { name: "Diana", score: 80 },
  //   { name: "Ethan", score: 75 },
  // ];

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
                <Typography variant="body1">
                  Projects Built: {completedProjects} / {totalProjects}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={projectProgress}
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
                        onClick={() => router.push("/build-project")}
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
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  No announcements found
                </Typography>
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

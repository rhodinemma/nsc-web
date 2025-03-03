"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Extension as ExtensionIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import useParticipantStore from "@/store/participantStore";
import Navbar from "@/components/Navbar";

interface Level {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  path: string;
}

interface Game {
  id: string;
  name: string;
  description: string;
  isAuthorizedtoTake: boolean;
  challenges: Level[];
}

interface CompletedLevel {
  levelId: string;
  levelName: string;
  score: number;
}

interface ChallengeProgress {
  challengeId: string;
  challengeName: string;
  completedLevels: CompletedLevel[];
}

const CircularProgressWithLabel = ({ value }: { value: number }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const Challenges = () => {
  const { email } = useParticipantStore();

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mazeEscapeOpen, setmazeEscapeOpen] = useState<boolean>(false);
  const [treasureHuntOpen, settreasureHuntOpen] = useState<boolean>(false);
  const [patternPainterOpen, setpatternPainterOpen] = useState<boolean>(false);

  const router = useRouter();

  const baseGames: Game[] = [
    {
      id: "672d1513bc573ddbaf73b560",
      name: "Maze Escape",
      description: "",
      isAuthorizedtoTake: true,
      challenges: [
        {
          id: "672d1595bc573ddbaf73b562",
          name: "Level 1",
          description: "Level 1",
          isCompleted: false,
          path: "/maze-escape/level-one",
        },
        {
          id: "672d177624ce330bc1ba79d3",
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/maze-escape/level-two",
        },
        {
          id: "672dd117eaef355fc63911e5",
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/maze-escape/level-three",
        },
        {
          id: "672dd11eeaef355fc63911e7",
          name: "Level 4",
          description: "Level 4",
          isCompleted: false,
          path: "/maze-escape/level-four",
        },
      ],
    },
    {
      id: "6748eb650a2fba264a22e700",
      name: "The bird",
      description: "",
      isAuthorizedtoTake: true,
      challenges: [
        {
          id: "6748ecdf0a2fba264a22e702",
          name: "Level 1",
          description: "Level 1",
          isCompleted: false,
          path: "/bird/level-one",
        },
        {
          id: "6748ed3f0a2fba264a22e704",
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/bird/level-two",
        },
        {
          id: "67912a6cbe66df3d39edf8a0",
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/bird/level-three",
        },
        {
          id: "67916472253ba1ccf5d603b6",
          name: "Level 4",
          description: "Level 4",
          isCompleted: false,
          path: "/bird/level-four",
        },
        {
          id: "67916552253ba1ccf5d603b8",
          name: "Level 5",
          description: "Level 5",
          isCompleted: false,
          path: "/bird/level-five",
        },
        {
          id: "679166f7253ba1ccf5d603ba",
          name: "Level 6",
          description: "Level 6",
          isCompleted: false,
          path: "/bird/level-six",
        },
        {
          id: "679167f8253ba1ccf5d603bc",
          name: "Level 7",
          description: "Level 7",
          isCompleted: false,
          path: "/bird/level-seven",
        },
        {
          id: "6791695c253ba1ccf5d603be",
          name: "Level 8",
          description: "Level 8",
          isCompleted: false,
          path: "/bird/level-eight",
        },
        {
          id: "67916bc0253ba1ccf5d603c0",
          name: "Level 9",
          description: "Level 9",
          isCompleted: false,
          path: "/bird/level-nine",
        },
        {
          id: "67916c8c253ba1ccf5d603c2",
          name: "Level 10",
          description: "Level 10",
          isCompleted: false,
          path: "/bird/level-ten",
        },
      ],
    },
    {
      id: "67ab69bb8663464f42566861",
      name: "Turtle",
      description: "",
      isAuthorizedtoTake: true,
      challenges: [
        {
          id: "67ab6a058663464f42566863",
          name: "Level 1",
          description: "Level 1",
          isCompleted: false,
          path: "/turtle/level-one",
        },
        {
          id: "67ab6a098663464f42566865",
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/turtle/level-two",
        },
        {
          id: "67ab6a0c8663464f42566867",
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/turtle/level-three",
        },
        {
          id: "67ab6a128663464f42566869",
          name: "Level 4",
          description: "Level 4",
          isCompleted: false,
          path: "/turtle/level-four",
        },
        {
          id: "67ab6a158663464f4256686b",
          name: "Level 5",
          description: "Level 5",
          isCompleted: false,
          path: "/turtle/level-five",
        },
        {
          id: "67ab6a188663464f4256686d",
          name: "Level 6",
          description: "Level 6",
          isCompleted: false,
          path: "/turtle/level-six",
        },
        {
          id: "67ab6a1b8663464f4256686f",
          name: "Level 7",
          description: "Level 7",
          isCompleted: false,
          path: "/turtle/level-seven",
        },
        {
          id: "67ab6a1f8663464f42566871",
          name: "Level 8",
          description: "Level 8",
          isCompleted: false,
          path: "/turtle/level-eight",
        },
        {
          id: "67ab6a228663464f42566873",
          name: "Level 9",
          description: "Level 9",
          isCompleted: false,
          path: "/turtle/level-nine",
        },
        {
          id: "67ab6a258663464f42566875",
          name: "Level 10",
          description: "Level 10",
          isCompleted: false,
          path: "/turtle/level-ten",
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchAndUpdateProgress = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `https://progressrounds-4f470cd5-1187-4be1-a866.cranecloud.io/api/v1/progress/participant/${email}`
        );
        const data = await response.json();

        if (data.status === "success") {
          // Create a map of completed levelIds
          const completedLevels = new Map();
          data.data.challenges.forEach((challenge: ChallengeProgress) => {
            challenge.completedLevels.forEach((level: CompletedLevel) => {
              completedLevels.set(level.levelId, true);
            });
          });

          // Update games with completion status
          const updatedGames = baseGames.map((game) => ({
            ...game,
            challenges: game.challenges.map((challenge) => ({
              ...challenge,
              isCompleted: completedLevels.has(challenge.id),
            })),
          }));

          setGames(updatedGames);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      fetchAndUpdateProgress();
    } else {
      setGames(baseGames);
      setIsLoading(false);
    }
  }, [email]);

  const gameactionMapper = (game_id: string): (() => void) => {
    switch (game_id) {
      case "672d1513bc573ddbaf73b560":
        return () => setmazeEscapeOpen((prev) => !prev);
      case "6748eb650a2fba264a22e700":
        return () => settreasureHuntOpen((prev) => !prev);
      case "67ab69bb8663464f42566861":
        return () => setpatternPainterOpen((prev) => !prev);
      default:
        return () => {};
    }
  };

  const getgameactionmapper = (game_id: string): boolean => {
    switch (game_id) {
      case "672d1513bc573ddbaf73b560":
        return mazeEscapeOpen;
      case "6748eb650a2fba264a22e700":
        return treasureHuntOpen;
      case "67ab69bb8663464f42566861":
        return patternPainterOpen;
      default:
        return false;
    }
  };

  const computeOverallScore = (game_id: string): number => {
    const game = games.find((g) => g.id === game_id);
    if (!game) return 0;

    const totalChallenges = game.challenges.length;
    const completedChallenges = game.challenges.filter(
      (challenge) => challenge.isCompleted
    ).length;

    return (completedChallenges / totalChallenges) * 100;
  };

  const handleNavigation = (path: string) => {
    router.push(`/challenges/${path}`);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

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
            Code Challenges
          </Typography>

          <Card
            sx={{
              width: "80%",
              maxWidth: 600,
              backgroundColor: "#f5f5f5",
              padding: 3,
              borderRadius: 2,
              position: "relative",
              zIndex: 2,
            }}
          >
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
              >
                <Typography variant="h6" color="secondary">
                  Your Progress
                </Typography>
                <Divider sx={{ width: "90%", mb: 2 }} />
              </Box>

              <Box display="flex" flexDirection="column" width="100%">
                <List>
                  {games.map((game, index) => (
                    <React.Fragment key={index}>
                      <ListItemButton
                        disabled={!game.isAuthorizedtoTake}
                        onClick={gameactionMapper(game.id)}
                      >
                        <ListItemIcon>
                          <CircularProgressWithLabel
                            value={computeOverallScore(game.id)}
                          />
                        </ListItemIcon>
                        <ListItemText primary={game.name} />
                        {getgameactionmapper(game.id) ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>
                      <Collapse
                        in={getgameactionmapper(game.id)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {game.challenges.map((challenge, idx) => (
                            <ListItemButton
                              key={idx}
                              sx={{ pl: 4 }}
                              disabled={challenge.isCompleted}
                              onClick={() => handleNavigation(challenge.path)}
                            >
                              <ListItemIcon>
                                <ExtensionIcon
                                  color={
                                    challenge.isCompleted
                                      ? "success"
                                      : "primary"
                                  }
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={challenge.name}
                                secondary={
                                  challenge.isCompleted ? "Completed" : null
                                }
                              />
                              <ListItemIcon>
                                <ArrowForwardIosIcon fontSize="small" />
                              </ListItemIcon>
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default Challenges;

/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";

import "./page.css";
import {
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";

import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExtensionIcon from "@mui/icons-material/Extension";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

interface Game {
  id: number;
  name: string;
  description: string;
  isAuthorizedtoTake: boolean;
  challenges: {
    id: number;
    name: string;
    description: string;
    isCompleted: boolean;
    path: string;
  }[];
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
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
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export const page = () => {
  const games: Game[] = [
    {
      id: 1,
      name: "Maze Escape",
      description: "",
      isAuthorizedtoTake: true,
      challenges: [
        {
          id: 1,
          name: "Level 1",
          description: "Level 1",
          isCompleted: true,
          path: "/maze-escape/1",
        },
        {
          id: 2,
          name: "Level 2",
          description: "Level 2",
          isCompleted: true,
          path: "/maze-escape/2",
        },
        {
          id: 3,
          name: "Level 3",
          description: "Level 3",
          isCompleted: true,
          path: "/maze-escape/3",
        },
      ],
    },
    {
      id: 2,
      name: "Treasure Hunt",
      description: "",
      isAuthorizedtoTake: true,
      challenges: [
        {
          id: 1,
          name: "Level 1",
          description: "Level 1",
          isCompleted: true,
          path: "/treasure-hunt/1",
        },
        {
          id: 2,
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/treasure-hunt/2",
        },
        {
          id: 3,
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/treasure-hunt/3",
        },
      ],
    },
    {
      id: 3,
      name: "Pattern Painter",
      description: "",
      isAuthorizedtoTake: false,
      challenges: [
        {
          id: 1,
          name: "Level 1",
          description: "Level 1",
          isCompleted: false,
          path: "/pattern-painter/1",
        },
        {
          id: 2,
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/pattern-painter/2",
        },
        {
          id: 3,
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/pattern-painter/3",
        },
      ],
    },
    {
      id: 4,
      name: "Collect the stars",
      description: "",
      isAuthorizedtoTake: false,
      challenges: [
        {
          id: 1,
          name: "Level 1",
          description: "Level 1",
          isCompleted: false,
          path: "/collect-the-stars/1",
        },
        {
          id: 2,
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/collect-the-stars/2",
        },
        {
          id: 3,
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/collect-the-stars/3",
        },
      ],
    },
    {
      id: 5,
      name: "Robot Builder",
      description: "",
      isAuthorizedtoTake: false,
      challenges: [
        {
          id: 1,
          name: "Level 1",
          description: "Level 1",
          isCompleted: false,
          path: "/robot-builder/1",
        },
        {
          id: 2,
          name: "Level 2",
          description: "Level 2",
          isCompleted: false,
          path: "/robot-builder/2",
        },
        {
          id: 3,
          name: "Level 3",
          description: "Level 3",
          isCompleted: false,
          path: "/robot-builder/3",
        },
      ],
    },
  ];

  const gameactionMapper = (game_id: number): (() => void) => {
    switch (game_id) {
      case 1:
        return () => setmazeEscapeOpen((prev) => !prev);
      case 2:
        return () => settreasureHuntOpen((prev) => !prev);
      case 3:
        return () => setpatternPainterOpen((prev) => !prev);
      case 4:
        return () => setcollectTheStarsOpen((prev) => !prev);
      case 5:
        return () => setrobotBuilderOpen((prev) => !prev);
      default:
        return () => {};
    }
  };

  const getgameactionmapper = (game_id: number): boolean => {
    switch (game_id) {
      case 1:
        return mazeEscapeOpen;
      case 2:
        return treasureHuntOpen;
      case 3:
        return patternPainterOpen;
      case 4:
        return collectTheStarsOpen;
      case 5:
        return robotBuilderOpen;
      default:
        return false;
    }
  };

  const computeOverallScore = (game_id: number): number => {
    const game = games.find((g) => g.id === game_id);
    if (!game) return 0;

    const totalChallenges = game.challenges.length;
    const completedChallenges = game.challenges.filter(
      (challenge) => challenge.isCompleted
    ).length;

    return (completedChallenges / totalChallenges) * 100;
  };

  const [mazeEscapeOpen, setmazeEscapeOpen] = useState<boolean>(false);
  const [treasureHuntOpen, settreasureHuntOpen] = useState<boolean>(false);
  const [patternPainterOpen, setpatternPainterOpen] = useState<boolean>(false);
  const [collectTheStarsOpen, setcollectTheStarsOpen] =
    useState<boolean>(false);
  const [robotBuilderOpen, setrobotBuilderOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(`/challenge/${path}`);
  };

  return (
    <>
      <Navbar />

      <div className="Blocklyheading">
        <Typography variant="h5" className="title" color="secondary">
          Code Challenges
        </Typography>
      </div>
      <div className="BlocklyPanels">
        <div className="BlocklyGamesPanel">
          <div className="PanelSubHeading">
            <Typography variant="h6" color={"secondary"}>
              Your Progress
            </Typography>
            <Divider style={{ width: "90%" }} />
          </div>
          <div className="PanelChannels">
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
                      {/* <span role="img" aria-label="game-icon">🎮</span> */}
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
                          onClick={() => handleNavigation(challenge.path)}
                        >
                          <ListItemIcon>
                            <ExtensionIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={challenge.name} />
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
          </div>
        </div>
        <div className="BlocklyGamesBoard">
          <div className="PanelSubHeading">
            <Typography variant="h6" color={"secondary"}>
              Challenge LeaderBoard
            </Typography>
            <Divider style={{ width: "90%" }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

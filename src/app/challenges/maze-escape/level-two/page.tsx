/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import { forwardRef } from "react";
import "./App.css";
import Image from "next/image";
import { javascriptGenerator } from "blockly/javascript";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Paper, Button, Box, Typography } from "@mui/material";
import { flushSync } from "react-dom";
import Marker from "@/components/Marker/Marker";
import Maze from "@/components/Maze/Maze";
import Target from "@/components/Target";
import gridTwo from "@/components/MazeGrids/gridTwo";
import Navbar from "@/components/Navbar";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

type Position = {
  x: number;
  y: number;
};

enum Direction {
  FORWARD = 20,
  LEFT = 0,
  RIGHT = 40,
  BACKWARD = 60,
}

function App() {
  const router = useRouter();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [frame, setFrame] = useState<number>(Direction.FORWARD);

  const [completed, setcompleted] = useState<boolean>(false);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const initializeBlockly = () => {
    Blockly.Blocks["move_forward"] = {
      init: function () {
        this.appendDummyInput().appendField("Move forward");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Move forward");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["turn_left"] = {
      init: function () {
        this.appendDummyInput().appendField("Turn Left");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Turn Left");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["turn_right"] = {
      init: function () {
        this.appendDummyInput().appendField("Turn right");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Turn right");
        this.setHelpUrl("");
      },
    };

    javascriptGenerator.forBlock["move_forward"] = function () {
      return `moveForward(${frame});\n`;
    };

    javascriptGenerator.forBlock["turn_left"] = function () {
      return "turnLeft();\n";
    };

    javascriptGenerator.forBlock["turn_right"] = function () {
      return "turnRight();\n";
    };
  };

  useEffect(() => {
    initializeBlockly();
  }, []);

  const moveForward = (frame: Direction) => {
    setPosition((prevPos) => {
      if (frame === Direction.FORWARD) {
        return { x: prevPos.x + 19, y: prevPos.y };
      } else if (frame === Direction.BACKWARD) {
        return { x: prevPos.x - 19, y: prevPos.y };
      } else if (frame === Direction.LEFT) {
        return { x: prevPos.x, y: prevPos.y - 19 };
      } else if (frame === Direction.RIGHT) {
        return { x: prevPos.x, y: prevPos.y + 19 };
      }
      return prevPos;
    });
  };

  const turnLeft = (current_direction: Direction): Direction => {
    let newDirection: Direction;

    switch (current_direction) {
      case Direction.FORWARD:
        newDirection = Direction.LEFT;
        break;
      case Direction.LEFT:
        newDirection = Direction.BACKWARD;
        break;
      case Direction.BACKWARD:
        newDirection = Direction.RIGHT;
        break;
      case Direction.RIGHT:
        newDirection = Direction.FORWARD;
        break;
      default:
        newDirection = Direction.FORWARD;
    }

    setFrame(newDirection);
    return newDirection;
  };

  const turnRight = (current_direction: Direction): Direction => {
    let newDirection: Direction;

    switch (current_direction) {
      case Direction.FORWARD:
        newDirection = Direction.RIGHT;
        break;
      case Direction.RIGHT:
        newDirection = Direction.BACKWARD;
        break;
      case Direction.BACKWARD:
        newDirection = Direction.LEFT;
        break;
      case Direction.LEFT:
        newDirection = Direction.FORWARD;
        break;
      default:
        newDirection = Direction.FORWARD;
    }

    setFrame(newDirection);
    return newDirection;
  };

  const runCode = () => {
    if (workspaceRef.current) {
      setcompleted(true);
      javascriptGenerator.addReservedWords("code");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      if (code) {
        const commands = code.split("\n").filter(Boolean);
        let current_direction: Direction = Direction.FORWARD;
        console.log(commands);
        let i = 0;
        const interval = setInterval(() => {
          if (i >= commands.length) {
            clearInterval(interval);
            return;
          }
          flushSync(() => {
            // eslint-disable-next-line no-eval
            // eval(commands[i]);
            if (commands[i].includes("moveForward")) {
              moveForward(current_direction);
            }

            if (commands[i].includes("turnLeft")) {
              current_direction = turnLeft(current_direction);
            }

            if (commands[i].includes("turnRight")) {
              current_direction = turnRight(current_direction);
            }
          });
          i++;
        }, 500);
      }
    }
  };

  const resetProgram = () => {
    setPosition({ x: 0, y: 0 });
    setcompleted(false);
    setFrame(Direction.FORWARD);
  };

  return (
    <>
      <Navbar />

      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF6F61, #FFD54F)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: 4,
          textAlign: "center",
          backgroundImage: `url('/puzzle.svg')`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
          backgroundPosition: "cover",
        }}
      >
        <div className="App" style={{ position: "relative", zIndex: 2 }}>
          <div
            className="mazeOneHeading"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              size="large"
              variant="text"
              sx={{ color: "white" }}
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", position: "relative", zIndex: 2 }}
            >
              Maze Escape / Level 2
            </Typography>
            <Button
              size="large"
              onClick={completed ? resetProgram : runCode}
              variant="contained"
              endIcon={<PlayArrowIcon />}
            >
              {completed ? "Reset Space" : "Run Program"}
            </Button>
          </div>

          <div className="mazeoneplayGround">
            <Paper className="blockly-container">
              <BlocklyWorkspace
                toolboxConfiguration={{
                  kind: "categoryToolbox",
                  contents: [
                    {
                      kind: "category",
                      name: "Actions",
                      colour: "blue",
                      contents: [
                        { kind: "block", type: "move_forward" },
                        { kind: "block", type: "turn_left" },
                        { kind: "block", type: "turn_right" },
                      ],
                    },
                  ],
                }}
                workspaceConfiguration={{}}
                className="fill-height"
                onWorkspaceChange={(workspace) => {
                  workspaceRef.current = workspace;
                }}
              />
            </Paper>

            <Paper className="mazeoneRun">
              <div className={"mazeOnePawn"}>
                <Marker frame={frame} position={position} />

                <Maze grid={gridTwo} />

                <Target top={"8.8dvh"} right={"2.9dvw"} />
              </div>
            </Paper>
          </div>
        </div>
      </Box>
    </>
  );
}

export default App;

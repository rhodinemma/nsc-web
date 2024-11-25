/* eslint-disable @next/next/no-img-element */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import "./page.css";
import Image from "next/image";
import { javascriptGenerator } from "blockly/javascript";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Paper,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
} from "@mui/material";
import { flushSync } from "react-dom";
import Navbar from "@/components/Navbar";
import {
  ArrowBack,
  CheckCircle,
  ConstructionOutlined,
} from "@mui/icons-material";
import Bird from "@/components/Bird/Bird";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import useParticipantStore from "@/store/participantStore";
import {registerFieldAngle, FieldAngle} from '@blockly/field-angle';


type Position = {
  x: number;
  y: number;
};

enum Direction {

  Angle45 = 9,
  LEFT = 99,
  RIGHT = 40,
  BACKWARD = 60,
}

type CurrentPossibleMovement = {
  possible_direction: number;
};

type CurrentMovementState = {
  current_step: number;
  current_direction: number;
  possible_directions: CurrentPossibleMovement[];
};

function App() {
  const router = useRouter();
  const { email } = useParticipantStore();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [frame, setFrame] = useState<number>(Direction.LEFT);
  const [openModal, setOpenModal] = useState(false);

  const [completed, setcompleted] = useState<boolean>(false);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const initializeBlockly = () => {
    registerFieldAngle()
    Blockly.Blocks['set_angle'] = {
        init: function () {
            this.appendDummyInput()
            .appendField("heading")
            .appendField(new FieldAngle(90), "ANGLE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Sets an angle for movement.");
            this.setHelpUrl("");
        }
    };
    
    javascriptGenerator.forBlock["set_angle"] = function () {
      return "setAngle();\n";
    };
  };

  useEffect(() => {
    initializeBlockly();
  }, []);

  const setAngle = (currentState: CurrentMovementState) => {

    setFrame(Direction.Angle45);

    setPosition({ x: 50 * Math.cos(45), y: 50 * Math.sin(-45) });

  }
  
  const runCode = () => {
    if (workspaceRef.current) {
      setcompleted(true);
      javascriptGenerator.addReservedWords("code");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      if (code) {
        const commands = code.split("\n").filter(Boolean);

        let currentMovementState: CurrentMovementState = {
          current_direction: Direction.LEFT,
          current_step: 0,
          possible_directions: [{ possible_direction: Direction.LEFT }],
        };

        let i = 0;
        const interval = setInterval(() => {
          if (i >= commands.length) {
            clearInterval(interval);
            return;
          }
          flushSync(() => {
            

            if (commands[i].includes("setAngle")) {
              setAngle(currentMovementState);
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
    setFrame(Direction.LEFT);
  };

  const handleNextClick = async () => {
    try {
      const response = await axios.post(
        `https://pt-9ffdb6ad-c541-4d3d-88f7.cranecloud.io/api/v1/progress`,
        {
          participant: email,
          challengeId: "672d1513bc573ddbaf73b560",
          levelId: "672d177624ce330bc1ba79d3",
          score: 10,
          completed: true
        }
      );
      console.log("Progress updated:", response.data);
      toast.success("Level score submitted successfully!");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update score!");
    }

    router.push("/challenges/maze-escape/level-three");
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
              The Bird Level 1
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
                        { kind: "block", type: "set_angle" },
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
                <Bird frame={frame} position={position} />
                <img
                  src="/challengeicons/worm.png"
                  width={87}
                  height={108}
                  style={{
                      position : 'relative',
                      right : '10dvw',
                  }}
                  alt="Marker"
                  />

                  <img
                      src="/challengeicons/nest.png"
                      width={87}
                      height={108}
                      style={{
                          position : 'relative',
                          bottom : '10dvh',
                          right : '10dvw',
          
                      }}
                      alt="Marker"
                  />
            </Paper>
          </div>
        </div>

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogContent>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
            >
              <CheckCircle style={{ fontSize: 100, color: "green" }} />
              <Typography variant="h6" align="center" style={{ marginTop: 10 }}>
                Are you ready for the next level ?
              </Typography>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleNextClick} color="primary">
              Next
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default App;

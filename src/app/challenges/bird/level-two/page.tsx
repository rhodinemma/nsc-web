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
import { javascriptGenerator, Order } from "blockly/javascript";
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
import { registerFieldAngle, FieldAngle } from "@blockly/field-angle";

type Position = {
  x: number;
  y: number;
};

enum Direction {
  Angle45 = 9,
  LEFT = 99,
  RIGHT = 40,
  BACKWARD = 60,
  FORWARD = 18,
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
  const [frame, setFrame] = useState<number>(Direction.FORWARD);
  const [openModal, setOpenModal] = useState(false);
  const [angle, setPropAngle] = useState<number>(0);

  const [wormVisible, setwormVisible] = useState<boolean>(true);
  const [nestVisible, setnestVisible] = useState<boolean>(true);

  const [completed, setcompleted] = useState<boolean>(false);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const initializeBlockly = () => {
    registerFieldAngle();
    Blockly.Blocks["set_angle"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("heading")
          .appendField(new FieldAngle(90), "ANGLE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Sets an angle for movement.");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["if_else"] = {
      init: function () {
        this.appendValueInput("CONDITION")
          .setCheck("Boolean")
          .appendField("if");
        this.appendStatementInput("DO").appendField("do");
        this.appendStatementInput("ELSE").appendField("else");
        this.setColour(210);
        this.setTooltip("Conditional block with if-else logic");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["check_worm"] = {
      init: function () {
        this.appendDummyInput().appendField("does not have worm");
        this.setOutput(true, "Boolean");
        this.setColour(120);
        this.setTooltip("Check if worm is present or not.");
        this.setHelpUrl("");
      },
    };

    javascriptGenerator.forBlock["if_else"] = function (block) {
      const condition =
        javascriptGenerator.valueToCode(block, "CONDITION", Order.NONE) ||
        "false";
      // const condition = block.getFieldValue('CONDITION');
      const doBranch = javascriptGenerator.statementToCode(block, "DO") || "";
      const elseBranch =
        javascriptGenerator.statementToCode(block, "ELSE") || "";
      return `if (${condition}) {\n${doBranch}} else {\n${elseBranch}}\n`;
    };

    javascriptGenerator.forBlock["check_worm"] = function (block) {
      return ["!hasWorm()", Order.LOGICAL_NOT];
    };

    javascriptGenerator.forBlock["set_angle"] = function (block) {
      return `setAngle(${block.getFieldValue("ANGLE")});\n`;
    };
  };

  useEffect(() => {
    initializeBlockly();
  }, []);

  const setMovement = (position: Position, angle: number) => {
    setPosition({
      x: position.x * Math.cos(angle),
      y: position.y * Math.sin(-angle),
    });
  };

  const setAngle = () => {
    //Turn the direction of the bird
    //Move the bird in the direction of the angle
  };

  const hasWorm = () => {
    //Check if the bird has a worm
    return true;
  };

  const moveBird = () => {
    setFrame(Direction.FORWARD);
    setPosition({ x: 16, y: 0 });
    setTimeout(() => {
      flushSync(() => setwormVisible(false));
      setFrame(Direction.LEFT);
    }, 1000);
    setTimeout(() => {
      setPosition({ x: 16, y: -42 });
    }, 2000);
  };

  const runCode = () => {
    if (workspaceRef.current) {
      setcompleted(true);
      javascriptGenerator.addReservedWords("code");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      if (code) {
        const success_code = `if (!hasWorm()) {\n  setAngle(0);\n} else {\n  setAngle(90);\n}\n`;

        if (success_code === code) {
          moveBird();
          setTimeout(() => {
            setOpenModal(true);
          }, 3000);
        } else {
          toast.error("Your code is incorrect. Please try again.");
        }
      }
    }
  };

  const resetProgram = () => {
    setPosition({ x: 0, y: 0 });
    setFrame(Direction.FORWARD);
    setwormVisible(true);
    setcompleted(false);
  };

  const handleNextClick = async () => {
    try {
      const response = await axios.post(
        `https://pt-9ffdb6ad-c541-4d3d-88f7.cranecloud.io/api/v1/progress`,
        {
          participant: email,
          challengeId: "6748eb650a2fba264a22e700",
          levelId: "6748ed3f0a2fba264a22e704",
          score: 10,
          completed: true,
        }
      );
      console.log("Progress updated:", response.data);
      toast.success("Level score submitted successfully!");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update score!");
    }

    router.push("/challenges/bird/level-three");
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
              The Bird Level 2
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
                      name: "Logic",
                      colour: "210",
                      contents: [
                        { kind: "block", type: "if_else" },
                        { kind: "block", type: "check_worm" },
                      ],
                    },
                    {
                      kind: "category",
                      name: "Actions",
                      colour: "230",
                      contents: [{ kind: "block", type: "set_angle" }],
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

              {wormVisible && (
                <img
                  src="/challengeicons/worm.png"
                  width={87}
                  height={108}
                  style={{
                    position: "absolute",
                    bottom: "10%", // Adjust percentage as needed
                    right: "7%", // Adjust percentage as needed
                  }}
                  alt="Marker"
                />
              )}

              {nestVisible && (
                <img
                  src="/challengeicons/nest.png"
                  width={87}
                  height={108}
                  style={{
                    position: "absolute",
                    top: "20%", // Adjust percentage as needed
                    right: "7%", // Adjust percentage as needed
                  }}
                  alt="Marker"
                />
              )}
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

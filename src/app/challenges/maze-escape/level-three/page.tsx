/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import { forwardRef } from "react";
import "./page.css";
import Image from "next/image";
import { javascriptGenerator } from "blockly/javascript";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Paper, Button, Box, Typography } from "@mui/material";
import { flushSync } from "react-dom";
import Marker from "@/components/Marker/Marker";
import Maze from "@/components/Maze/Maze";
import Target from "@/components/Target";
import gridThree from "@/components/MazeGrids/gridThree";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowBack } from "@mui/icons-material";

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

type CurrentPossibleMovement = {
  possible_direction: number;
}

type CurrentMovementState = {
  current_step: number;
  current_direction: number;
  possible_directions : CurrentPossibleMovement[];
}

function App() {
  const router = useRouter();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [frame, setFrame] = useState<number>(Direction.FORWARD);

  // const [comp_possible_directions , setpossible_directions] = useState([{possible_direction : Direction.FORWARD}])
  const [completed, setcompleted] = useState<boolean>(false);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // const {current_direction, possible_directions, setCurrentMovementState } = useCurrentMovementStore();



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

  const verifyFeasibleDirection = (current_state : CurrentMovementState) : boolean => {
      
      if (current_state.current_direction == Direction.FORWARD && current_state.current_step === 1){
        return false
      }

      if (current_state.current_direction == Direction.RIGHT && current_state.current_step === 3){
        return false
      }

      if (current_state.current_direction == Direction.FORWARD && current_state.current_step === 5){
        return false
      }

      if (current_state.current_direction == Direction.LEFT && current_state.current_step === 7){
        return false
      }
      
      if (current_state.possible_directions.some(d => d.possible_direction === current_state.current_direction)) {
          return true
      }

      return false
  }

  const moveForward = (current_state: CurrentMovementState) : CurrentMovementState => {

    let new_direction : CurrentMovementState = current_state

    new_direction = {
      ...current_state,
      current_step : current_state.current_step + 1,
    }

    if (!verifyFeasibleDirection(current_state)){
        alert('Not feasible')
    }else {
      setPosition((prevPos) => {
       
        if (current_state.current_direction === Direction.FORWARD) {
  
          return { x: prevPos.x + 10.5, y: prevPos.y };
  
        } else if (current_state.current_direction === Direction.BACKWARD) {
          return { x: prevPos.x - 19, y: prevPos.y };
        } else if (current_state.current_direction === Direction.LEFT) {
          return { x: prevPos.x, y: prevPos.y - 19 };
        } else if (current_state.current_direction === Direction.RIGHT) {
          
          return { x: prevPos.x, y: prevPos.y + 19 };
        }
        return prevPos;
      });
    }

    
    

    return new_direction


  };

  const turnLeft = (current_state: CurrentMovementState): CurrentMovementState => {
    let newDirection: CurrentMovementState;

    switch (current_state.current_direction) {
      case Direction.FORWARD:
        if (current_state.current_step == 5){
          newDirection = {current_direction : Direction.LEFT , current_step : current_state.current_step +1, possible_directions : [
            {possible_direction : Direction.LEFT}
          ]};
        }else {
          newDirection = {current_direction : Direction.LEFT , current_step : current_state.current_step +1, possible_directions : []};
        }
        break;
      case Direction.LEFT:
        newDirection = {current_direction : Direction.BACKWARD , current_step : current_state.current_step +1, possible_directions : []};
        break;
      case Direction.BACKWARD:
        newDirection = {current_direction : Direction.RIGHT , current_step : current_state.current_step +1, possible_directions : []};
        break;
      case Direction.RIGHT:
        if (current_state.current_step === 3){
          newDirection = {current_direction : Direction.FORWARD , current_step : current_state.current_step +1, possible_directions : [
            {possible_direction : Direction.FORWARD}
          ]};
        }else{
          newDirection = {current_direction : Direction.FORWARD , current_step : current_state.current_step +1, possible_directions : []};
        }
        break;
      default:
        newDirection = {current_direction : Direction.FORWARD , current_step : current_state.current_step +1, possible_directions : []};
    }

    setFrame(newDirection.current_direction);
    return newDirection;
  };

  const turnRight = (current_state: CurrentMovementState): CurrentMovementState => {
    let newDirection: CurrentMovementState;
    switch (current_state.current_direction) {
      case Direction.FORWARD:
        if (current_state.current_step == 1){
          
          newDirection = {current_direction : Direction.RIGHT , current_step : current_state.current_step +1, possible_directions : [
            {possible_direction : Direction.RIGHT}
          ]};


        }else {
          newDirection = {current_direction : Direction.RIGHT , current_step : current_state.current_step +1, possible_directions : []};

        }

        break;
      case Direction.RIGHT:
        newDirection = {current_direction : Direction.BACKWARD , current_step : current_state.current_step +1, possible_directions : []};
        break;
      case Direction.BACKWARD:
        newDirection = {current_direction : Direction.LEFT , current_step : current_state.current_step +1, possible_directions : []};
        break;
      case Direction.LEFT:
        newDirection = {current_direction : Direction.FORWARD , current_step : current_state.current_step +1, possible_directions : []};
        break;
      default:
        newDirection = {current_direction : Direction.FORWARD , current_step : current_state.current_step +1, possible_directions : []};
    }

    setFrame(newDirection.current_direction);
    return newDirection;
  };

  const runCode = () => {
    if (workspaceRef.current) {
      setcompleted(true);
      javascriptGenerator.addReservedWords("code");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      if (code) {
        const commands = code.split("\n").filter(Boolean);

        // let current_direction: Direction = Direction.FORWARD;

        let currentMovementState : CurrentMovementState = {
          current_direction : Direction.FORWARD,
          current_step : 0,
          possible_directions : [
            {possible_direction : Direction.FORWARD}
          ]
        }


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
              currentMovementState = moveForward(currentMovementState);
            }

            if (commands[i].includes("turnLeft")) {
              currentMovementState = turnLeft(currentMovementState);
      
            }

            if (commands[i].includes("turnRight")) {
              currentMovementState = turnRight(currentMovementState);
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
              Maze Escape / Level 3
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

                <Maze grid={gridThree} />

                <Target top={"-14dvh"} right={"1.3dvw"} />
              </div>
            </Paper>
          </div>
        </div>
      </Box>
      {/* <Footer /> */}
    </>
  );
}

export default App;

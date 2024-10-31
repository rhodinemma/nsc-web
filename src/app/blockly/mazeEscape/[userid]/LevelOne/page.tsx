/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import { forwardRef } from "react";
import "./App.css";
import Image from 'next/image'
import { javascriptGenerator } from "blockly/javascript";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Paper , Button } from "@mui/material";
import { flushSync } from "react-dom";

type Position = {
  x: number;
  y: number;
};

function App() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [completed , setcompleted] = useState<boolean>(false)
  
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const initializeBlockly = () => {
    

    Blockly.Blocks['move_pin_forward'] = {
      init: function () {
        this.appendDummyInput().appendField("Move pin forward");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Move pin forward");
        this.setHelpUrl("");
      }
    }

    Blockly.Blocks['move_pin_left'] = {
      init: function () {
        this.appendDummyInput().appendField("Move pin left");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Move pin left");
        this.setHelpUrl("");
      }
    }


    javascriptGenerator.forBlock["move_pin_forward"] = function () {
      return "movePinForward();\n"
    }

    javascriptGenerator.forBlock["move_pin_left"] = function () {
      return "movePinLeft();\n"
    }
  };

  useEffect(() => {
    initializeBlockly();
  }, []);

  

  const movePinForward = () => {
    setPosition((prevPos) => ({
      x : prevPos.x + 4,
      y: prevPos.y ,
    }))
  }

  

  const movePinLeft = () => {
      setPosition((prevPos) => ({
        x : prevPos.x ,
        y: prevPos.y - 4,
      }))
    
  }

  
  const runCode = () => {
    if (workspaceRef.current) {
      setcompleted(true)
      javascriptGenerator.addReservedWords("code");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      if (code) {
        const commands = code.split('\n').filter(Boolean);
        console.log(commands);
        commands.forEach(command => {
          // eslint-disable-next-line no-eval
          flushSync(()=>{
            eval(command);
          })
        });
      }
    }
  };

  const resetProgram = () => {
    setPosition({x : 0 , y : 0})
    setcompleted(false)
  }

  return (
    <div className="App">

      <div className="mazeOneHeading">
        <h1>Level One</h1>
        <Button onClick={completed ? resetProgram : runCode} variant="contained" endIcon={<PlayArrowIcon />}>
          {completed? ("Reset Space") : ("Run Program")}
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
                    { kind: "block", type: "move_pin_forward" },
                    { kind: "block", type: "move_pin_left"}
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
              {/* <circle cx="5" cy="10" r="3" fill="black" /> */}
            <div className={"mazeOnePawn"}>
                <Image style ={{
                  position : 'relative',
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translate(${position.x * 50}px, ${position.y * 50}px)`,
                }} src="/challengeicons/pawn.png" alt="logo" width={50} height={50}/>

                <svg className="mazeOnePath" width="200" height="200">
                    <line
                    x1="10"
                    y1="10"
                    x2="190"
                    y2="10"
                    stroke="black"
                    strokeWidth="2"
                    />
                </svg>

                
            </div>
              
        </Paper>
      </div>

      
      {/* <button onClick={runCode}>Run Code</button>

      <div className="grid-container">
        <div
          className="pin"
          style={{
            transform: `translate(${position.x * 50}px, ${position.y * 50}px)`,
          }}
        ></div>
      </div> */}
    </div>
  );
}

export default App;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import { forwardRef } from "react";
import "./App.css";
import { javascriptGenerator } from "blockly/javascript";

type Position = {
  x: number;
  y: number;
};

function App() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const initializeBlockly = () => {
    Blockly.Blocks["move_pin"] = {
      init: function () {
        this.appendDummyInput().appendField("Move pin two left and forward");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Move pin two units to the left and forward");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["move_pin_left_forward"] = {
      init: function () {
        this.appendDummyInput().appendField("Move pin left and forward");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("Move pin one unit to the left and forward");
        this.setHelpUrl("");
      },
    };

    javascriptGenerator.forBlock["move_pin"] = function () {
      return "movePin();\n";
    };

    javascriptGenerator.forBlock["move_pin_left_forward"] = function () {
      return "movePinLeftForward();\n";
    };
  };

  useEffect(() => {
    initializeBlockly();
  }, []);

  const movePin = () => {
    setPosition((prevPos) => ({
      x: prevPos.x - 2,
      y: prevPos.y + 2,
    }));
  };

  const movePinLeftForward = () => {
    setPosition((prevPos) => ({
      x: prevPos.x - 1,
      y: prevPos.y + 1,
    }));
  };

  const runCode = () => {
    if (workspaceRef.current) {
      javascriptGenerator.addReservedWords("code");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      console.log(code);
      if (code) {
        // eslint-disable-next-line no-eval
        eval(code);
      }
    }
  };

  return (
    <div className="App">
      <h1>Blockly Pin Movement</h1>

      <div className="blockly-container">
        <BlocklyWorkspace
          toolboxConfiguration={{
            kind: "categoryToolbox",
            contents: [
              {
                kind: "category",
                name: "Actions",
                colour: "blue",
                contents: [
                  { kind: "block", type: "move_pin" },
                  { kind: "block", type: "move_pin_left_forward" },
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
      </div>

      <button onClick={runCode}>Run Code</button>

      <div className="grid-container">
        <div
          className="pin"
          style={{
            transform: `translate(${position.x * 50}px, ${position.y * 50}px)`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;

"use client";
import React, { useRef, useEffect } from "react";
// import Blockly from "blockly";
// Import Blockly core.
// import * as Blockly from "blockly/core";
// Import the default blocks.
import * as libraryBlocks from "blockly/blocks";
// Import a generator.
import { javascriptGenerator } from "blockly/javascript";
const Blockly = import("blockly/core");
// import { BlocklyOptions } from 'blockly/core/blockly';

// import "../../styles/globals.css";
// import { setupCustomBlocks } from "./customBlocks";

const setupCustomBlocks = async () => {
  (await Blockly).Blocks["print_hello"] = {
    init: function () {
      this.appendDummyInput().appendField("Print Hello World");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  };
};

const BlocklyComponent: React.FC = () => {
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeBlockly = async () => {
      await setupCustomBlocks(); // Set up custom blocks

      if (blocklyDivRef.current) {
        const blockly = await Blockly;
        blockly.inject(blocklyDivRef.current, {
          toolbox: `<xml>
                       <block type="print_hello"></block>
                     </xml>`,
        });
      }
    };

    initializeBlockly();
  }, []);

  return <div ref={blocklyDivRef} style={{ height: "600px", width: "100%" }} />;
};

export default BlocklyComponent;

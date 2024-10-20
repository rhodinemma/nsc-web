import Blockly from 'blockly';

const setupCustomBlocks = () => {
    Blockly.Blocks['print_hello'] = {
        init: function () {
            this.appendDummyInput().appendField('Print Hello World');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };
};

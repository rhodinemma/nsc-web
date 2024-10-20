import React from "react";
import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div>
      <h2>Welcome to the Blockly & Scratch App</h2>
      <p>Choose a section to start:</p>
      <ul>
        <li>
          <Link href="/blockly">Blockly Challenges</Link>
        </li>
        <li>
          <Link href="/scratch">Scratch Editor</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;

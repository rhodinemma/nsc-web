"use client";
import useChallengeStore from "@/store/challengeStore";
import React from "react";
import BlocklyComponent from "./BlocklyComponent";

const BlocklyPage: React.FC = () => {
  const { currentChallenge, score, nextChallenge, incrementScore } =
    useChallengeStore();

  const handleSubmit = () => {
    incrementScore();
    nextChallenge();
  };

  return (
    <div>
      <h1>Current Challenge: {currentChallenge}</h1>
      <h2>Score: {score}</h2>
      <BlocklyComponent />
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Submit Challenge
      </button>
    </div>
  );
};

export default BlocklyPage;

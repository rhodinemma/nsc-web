"use client";
import React, { useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useParticipantStore from "@/store/participantStore";
import axios from "axios";

const LevelNinePage: React.FC = () => {
  const router = useRouter();
  const { email } = useParticipantStore();

  const submitScores = useCallback(async () => {
    try {
      const response = await axios.post(
        `https://pt-9ffdb6ad-c541-4d3d-88f7.cranecloud.io/api/v1/progress`,
        {
          participant: email,
          challengeId: "67c8703d3eb5a416e5d17830",
          levelId: "67c871e83eb5a416e5d17842",
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

    router.push("/challenges/music/level-nine");
  }, [email, router]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://games-5qkr.onrender.com") {
        return;
      }

      //failed or completed
      console.log("Message received from iframe:", event.data);

      if (event.data.action === "completed") {
        submitScores();
        toast.success("Level 9 completed!");
      } else {
        toast.error("Level 9 failed!. Please try again");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [submitScores]);

  return (
    <>
      <Navbar />
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <iframe
          src="https://games-5qkr.onrender.com/music?lang=en&level=9"
          style={{ width: "95%", height: "95%" }}
          frameBorder="0"
          allowFullScreen
          title="Level Nine Game"
        ></iframe>
      </div>
    </>
  );
};

export default LevelNinePage;

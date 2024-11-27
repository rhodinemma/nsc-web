"use client";
import Navbar from "@/components/Navbar";

function BuildProjectPage() {
  return (
    <>
      <Navbar />

      <iframe
        src="https://staging.nationalscratchcompetition.org/"
        width="100%"
        height={700}
      ></iframe>
    </>
  );
}

export default BuildProjectPage;

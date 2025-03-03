"use client";

import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        color: "black",
        py: 2,
        textAlign: "center",
      }}
    >
      <hr />
      <Typography
        variant="body2"
        sx={{ mb: 1, position: "relative", zIndex: 2, color: "white" }}
      >
        © {new Date().getFullYear()} Code Academy Uganda. All rights reserved.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mb: 1,
          position: "relative",
          zIndex: 2,
          color: "white",
        }}
      >
        <Link href="/terms" color="inherit" underline="hover">
          Terms of Service
        </Link>
        <Link href="/privacy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
        <Link href="/contact" color="inherit" underline="hover">
          Contact Us
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;

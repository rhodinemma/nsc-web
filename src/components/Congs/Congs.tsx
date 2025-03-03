import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  useTheme,
  Divider,
  Fade,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";

const CongratulationsSection = ({ userName = "Participant" }) => {
  const theme = useTheme();

  const router = useRouter();

  return (
    <Fade in={true} timeout={1000}>
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: "white",
          pl: 3,
          pr: 3,
          pt: 4,
          pb: 4,
          border: `1px solid ${theme.palette.primary.light}`,
          boxShadow: `0 10px 30px -15px ${theme.palette.primary.main}`,
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <EmojiEventsIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
            Congratulations, {userName}!
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ ml: 7, mb: 3 }}>
          You have successfully completed Round 1!
        </Typography>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", my: 3 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Welcome to Round 2
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 500, mb: 2 }}>
              You have demonstrated exceptional skills and dedication in Round
              1. Now you are ready to take on greater challenges and expand your
              expertise in Round 2.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="New Advanced Challenges"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label="Special Resources Unlocked"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            </Box>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "white",
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
                mr: 2,
              }}
              onClick={() => router.push("/challenges")}
            >
              Blockly Challenges
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{
                // bgcolor: "white",
                // color: theme.palette.primary.main,
                color: "white",
                borderColor: "white",
              }}
              onClick={() => router.push("/projects")}
            >
              Scratch Projects
            </Button>
          </Box>

          <Box
            sx={{
              mt: { xs: 4, md: 0 },
              width: { xs: "100%", md: "200px" },
              height: { xs: "100px", md: "200px" },
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Trophy/Badge visualization */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                2
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  width: "140%",
                  height: "140%",
                  borderRadius: "50%",
                  border: "2px dashed rgba(255, 255, 255, 0.5)",
                  animation: "spin 20s linear infinite",
                }}
              />
              <style jsx>{`
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CongratulationsSection;

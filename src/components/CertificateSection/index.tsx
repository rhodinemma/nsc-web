import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogContent,
  CircularProgress,
  Paper,
  Stack,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Visibility";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import useParticipantStore from "@/store/participantStore";

export function capitalizeFullName(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

// Styled components
const CelebrationCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.primary.light}`,
}));

const GradientOverlay = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.secondary.light}33)`,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
}));

const PreviewContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: 500,
  overflow: "hidden",
  //   marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const CertificateSection: React.FC = () => {
  const { username } = useParticipantStore();

  const [showConfetti, setShowConfetti] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { width, height } = useWindowSize();

  // Show confetti on initial load
  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const generatePreview = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://nsc-nine-ab95ebc2-4bb5-4518-8d9b.ahumain.cranecloud.io/api/v1/participant/generate-certificate",
        {
          name: capitalizeFullName(username),
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCertificate = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.post(
        "https://nsc-nine-ab95ebc2-4bb5-4518-8d9b.ahumain.cranecloud.io/api/v1/participant/generate-certificate",
        { name: capitalizeFullName(username) },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `NSC2025 Certificate-${capitalizeFullName(username)}.pdf`;
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert("Something went wrong while downloading the certificate.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={300}
          gravity={0.1}
        />
      )}

      <CelebrationCard>
        <GradientOverlay />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <EmojiEventsIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography
              variant="h4"
              component="h2"
              color="primary.main"
              gutterBottom
            >
              Congratulations!
            </Typography>
          </Stack>

          <Typography variant="h6" gutterBottom>
            Thank you for participating in the <strong>NSC 2025</strong>!
          </Typography>

          <Typography variant="body1" paragraph>
            Thank you for being part of this competition — your participation in
            the Blockly challenges and Scratch projects made it a success. We
            have prepared a certificate to recognize your achievement and
            celebrate the effort you put into completing the activities.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="outlined"
                startIcon={
                  isLoading ? <CircularProgress size="1rem" /> : <PreviewIcon />
                }
                onClick={generatePreview}
                disabled={isLoading}
                fullWidth
              >
                {isLoading
                  ? "Creating your certificate....."
                  : "Get Certificate"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </CelebrationCard>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6">Certificate Preview</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : previewUrl ? (
            <Box>
              <PreviewContainer>
                <iframe
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  width="100%"
                  height="100%"
                  title="Certificate Preview"
                  style={{ border: "none" }}
                />
              </PreviewContainer>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isDownloading ? (
                    <CircularProgress size="1rem" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={downloadCertificate}
                disabled={isDownloading}
                fullWidth
              >
                {isDownloading
                  ? "Downloading certificate...."
                  : "Download your certificate"}
              </Button>
            </Box>
          ) : (
            <Typography color="error">Failed to load preview</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CertificateSection;

import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Visibility";

export default function CertificateGenerator() {
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const generatePreview = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3002/api/v1/participant/preview-certificate",
        { name }
      );
      const base64Pdf = response.data.preview;
      setPreviewUrl(`data:application/pdf;base64,${base64Pdf}`);
    } catch (err) {
      setError("Failed to generate preview");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCertificate = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    // Create a download link
    const link = document.createElement("a");
    link.href = `http://localhost:3002/api/v1/participant/preview-certificate?name=${encodeURIComponent(
      name
    )}`;
    link.setAttribute("download", `certificate-${name}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Generate Your Certificate
        </Typography>

        <Box component="form" sx={{ mt: 4 }}>
          <TextField
            fullWidth
            id="name"
            label="Enter Your Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your full name"
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={generatePreview}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PreviewIcon />
              )
            }
          >
            {isLoading ? "Generating Preview..." : "Preview Certificate"}
          </Button>
        </Box>

        {error && !error.includes("name") && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {previewUrl && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Certificate Preview
            </Typography>

            <Paper
              elevation={2}
              sx={{
                width: "100%",
                height: 500,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <iframe
                src={previewUrl}
                width="200%"
                height="100%"
                title="Certificate Preview"
                style={{ border: "none" }}
              />
            </Paper>

            <Button
              variant="contained"
              color="success"
              onClick={downloadCertificate}
              startIcon={<DownloadIcon />}
              size="large"
              fullWidth
            >
              Download Certificate
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

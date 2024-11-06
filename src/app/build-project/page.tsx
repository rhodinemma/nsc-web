import { Box, Card, CardContent, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Navbar from "@/components/Navbar";

function ComingSoonPage() {
  return (
    <>
      <Navbar />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "80vh",
          p: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 500, textAlign: "center", p: 2 }}>
          <CardContent>
            <Box mb={2}>
              <AccessTimeIcon color="primary" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h4" color="text.primary" gutterBottom>
              Coming Soon!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              We&apos;re working hard to bring you something amazing. Stay tuned
              for updates!
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ComingSoonPage;

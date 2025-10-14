import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function RecordingTipsInner() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Recording tips
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Watch this short video for tips and guidance on recording your feedback.
      </Typography>
      <Box
        sx={{
          position: "relative",
          pt: "56.25%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
          mb: 3,
        }}
      >
        <iframe
          title="recording-tips"
          src="https://www.youtube.com/embed/2Vv-BfVoq4g"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </Box>
      <Typography variant="subtitle1" fontWeight={700}>
        Things to remember
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        1. Read each task out loud and speak clearly.
        <br />
        2. Take your time; there are no right or wrong answers.
        <br />
        3. Share your honest opinions.
      </Typography>
      <Box textAlign="right" mt={3}>
        <Button
          variant="contained"
          onClick={() => navigate(`/testflow/${campaignId}/setup`)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}

export default function RecordingTips() {
  return <RecordingTipsInner />;
}

import React from "react";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestFlow } from "./TestFlowProvider";

function StartScenarioInner() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { startRecording } = useTestFlow();

  const onStart = async () => {
    await startRecording();
    navigate(`/testflow/${campaignId}/scenario`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        All set! Before you start, remember:
      </Typography>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography>
          • Speak your thoughts out loud as you do each task.
        </Typography>
        <Typography>• Find a quiet place to take the test.</Typography>
        <Typography>• Minimize private tabs or apps.</Typography>
      </Stack>
      <Box textAlign="right">
        <Button variant="contained" color="error" onClick={onStart}>
          Start recording
        </Button>
      </Box>
    </Container>
  );
}

export default function StartScenario() {
  return <StartScenarioInner />;
}

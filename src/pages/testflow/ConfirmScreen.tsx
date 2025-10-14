import React, { useEffect, useRef } from "react";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestFlow } from "./TestFlowProvider";

function ConfirmScreenInner() {
  const { displayStream } = useTestFlow();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const { campaignId } = useParams();

  useEffect(() => {
    if (videoRef.current && displayStream) {
      videoRef.current.srcObject = displayStream as any;
      videoRef.current.play().catch(() => {});
    }
  }, [displayStream]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Confirm your selected screen
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Make sure the preview shows your <b>entire</b> browser window.
      </Typography>
      <Box sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 2, mb: 2 }}>
        <video ref={videoRef} style={{ width: "100%" }} muted playsInline />
      </Box>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={() => navigate(`/testflow/${campaignId}/setup`)}>
          Reset sharing
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/testflow/${campaignId}/mic`)}
        >
          Next
        </Button>
      </Stack>
    </Container>
  );
}

export default function ConfirmScreen() {
  return <ConfirmScreenInner />;
}

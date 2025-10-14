import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestFlow } from "./TestFlowProvider";

function QuickSetupInner() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { setDisplayStream, setMicStream } = useTestFlow();
  const [err, setErr] = useState<string>("");

  const shareAccess = async () => {
    setErr("");
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setDisplayStream(display);
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(mic);
      navigate(`/testflow/${campaignId}/confirm`);
    } catch (e: any) {
      setErr(e?.message || "Permission denied or device not found");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Quick setup
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        To record, allow access to your <b>entire screen</b> and{" "}
        <b>microphone</b>.
      </Typography>
      {!!err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      <Stack spacing={2}>
        <Typography>You'll need to share:</Typography>
        <ul>
          <li>Microphone</li>
          <li>Screen</li>
        </ul>
        <Box textAlign="right">
          <Button variant="contained" onClick={shareAccess}>
            Share access
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default function QuickSetup() {
  return <QuickSetupInner />;
}

import React, { useEffect, useRef } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestFlow } from "./TestFlowProvider";

function MicrophoneCheckInner() {
  const { micStream } = useTestFlow();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const { campaignId } = useParams();

  useEffect(() => {
    if (!micStream || !canvasRef.current) return;
    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(micStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      const level = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1976d2";
      ctx.fillRect(0, 0, (level / 255) * canvas.width, canvas.height);
    };
    draw();
    return () => audioCtx.close();
  }, [micStream]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Microphone check
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Please say, “I’m ready to think out loud.”
      </Typography>
      <Box sx={{ borderRadius: 1, overflow: "hidden", boxShadow: 1, mb: 2 }}>
        <canvas ref={canvasRef} width={560} height={24} />
      </Box>
      <Box textAlign="right">
        <Button
          variant="contained"
          onClick={() => navigate(`/testflow/${campaignId}/tabs`)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}

export default function MicrophoneCheck() {
  return <MicrophoneCheckInner />;
}

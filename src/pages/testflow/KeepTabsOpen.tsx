import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function KeepTabsOpenInner() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Keep two tabs open
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        You’ll need two tabs during the test: one for the instructions and one
        for the product you’re testing.
      </Typography>
      <Box textAlign="right">
        <Button
          variant="contained"
          onClick={() => navigate(`/testflow/${campaignId}/start`)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}

export default function KeepTabsOpen() {
  return <KeepTabsOpenInner />;
}

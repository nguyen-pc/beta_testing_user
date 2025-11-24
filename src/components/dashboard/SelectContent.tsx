import * as React from "react";
import { Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../src/assets/logo2.png";

export default function SelectContent() {
  const navigate = useNavigate();
  const { campaignId, projectId } = useParams();

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 1,
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="BetaTesting Logo"
        sx={{
          width: 160,
          height: "auto",
          objectFit: "contain",
          borderRadius: 2,
          // mb: 3,
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleBack}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 2,
          px: 3,
        }}
      >
        ← Back to Home
      </Button>
    </Box>
  );
}

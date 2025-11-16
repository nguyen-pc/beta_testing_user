import * as React from "react";
import { Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../src/assets/logo2.png";

export default function SelectContent() {
  const navigate = useNavigate();
  const { campaignId, projectId } = useParams();

  const handleBack = () => {
    navigate(`/dashboard/project/${projectId}`);
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
    </Box>
  );
}

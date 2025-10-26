import { Box, Typography, Button, Card } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignUpFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "Đăng ký không thành công.";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Card
        sx={{
          p: 4,
          width: 450,
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" color="error.main" gutterBottom>
          ❌ Đăng ký thất bại
        </Typography>
        <Typography sx={{ mb: 2 }}>{message}</Typography>
        <Button variant="contained" onClick={() => navigate("/signup-company")}>
          Thử lại
        </Button>
      </Card>
    </Box>
  );
}

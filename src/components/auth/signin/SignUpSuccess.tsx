import { Box, Typography, Button, Card } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignUpSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

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
        <Typography variant="h4" color="success.main" gutterBottom>
          🎉 Đăng ký thành công!
        </Typography>
        <Typography>
          Hệ thống đã gửi email xác nhận đến{" "}
          <b>{email || "email công ty của bạn"}</b>.  
          Vui lòng kiểm tra hộp thư đến để kích hoạt tài khoản.
        </Typography>
        {/* <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate("/signin")}
        >
          Đăng nhập ngay
        </Button> */}
      </Card>
    </Box>
  );
}

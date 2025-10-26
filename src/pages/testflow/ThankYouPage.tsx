import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useParams } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 100, mb: 3 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎉 Cảm ơn bạn đã hoàn thành khảo sát!
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 600, mb: 4 }}
      >
        Phản hồi của bạn đã được ghi nhận và sẽ giúp chúng tôi cải thiện sản
        phẩm tốt hơn trong tương lai. Xin chân thành cảm ơn sự đóng góp của bạn.
      </Typography>

      <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => navigate(`/testflow/${campaignId}`)}
        >
          🔙 Quay lại chiến dịch
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
        >
          🏠 Về trang chủ
        </Button>
      </Box>
    </Box>
  );
}

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface Author {
  name: string;
  avatar?: string;
}

interface Campaign {
  id: number;
  title: string;
  description: string;
  tag?: string;
  image?: string;
  authors?: Author[];
  startDate?: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: (campaignId: number) => void;
}

// 🧩 Card container
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "530px",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[3],
  },
}));

// 🧩 Card content
const StyledCardContent = styled(CardContent)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  padding: 16,
  "&:last-child": {
    paddingBottom: 16,
  },
});

// 🧩 Description – line clamp hoạt động thực sự
const Description = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  lineHeight: 1.4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1, // Giới hạn 2 dòng
  wordBreak: "break-word",
  maxHeight: "2.8em",
}));

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  return (
    <StyledCard
      onClick={() => onClick && onClick(campaign.id)}
      variant="outlined"
    >
      {/* === Ảnh chiến dịch === */}
      <CardMedia
        component="img"
        alt={campaign.title}
        image={
          campaign.image ||
          "https://picsum.photos/800/450?random=6"
        }
        sx={{
          height: { xs: 200, md: 180 },
          objectFit: "cover",
        }}
      />

      {/* === Nội dung === */}
      <StyledCardContent>
        <Typography
          variant="caption"
          color="primary"
          sx={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          {campaign.tag || "No tag"}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mt: 0.5,
            mb: 0.5,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {campaign.title}
        </Typography>

        {/* ✅ Mô tả – cắt dòng an toàn */}
        <Description>
          {campaign.description || "No description available."}
        </Description>

        {/* === Tác giả / Ngày === */}
        {campaign.authors && campaign.authors.length > 0 && (
          <Stack direction="row" spacing={1} alignItems="center" mt="auto">
            {campaign.authors.slice(0, 2).map((a, i) => (
              <Avatar
                key={i}
                src={a.avatar}
                alt={a.name}
                sx={{ width: 28, height: 28 }}
              />
            ))}
            <Typography variant="body2" color="text.secondary">
              {campaign.startDate
                ? new Date(campaign.startDate).toLocaleDateString()
                : "No date"}
            </Typography>
          </Stack>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

export default CampaignCard;

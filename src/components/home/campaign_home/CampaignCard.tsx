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
import parse from "html-react-parser";

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
  endDate?: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: (campaignId: number) => void;
}

//  Card container
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "530px",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[3],
  },
}));

//  Card content
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

//  Description
const Description = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  lineHeight: 1.4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  wordBreak: "break-word",
  maxHeight: "2.8em",
}));

// Status Badge
const StatusBadge = styled(Box)(({ color }: { color: string }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: color,
  color: "white",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
}));

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  console.log("Campaign data in CampaignCard:", campaign);
  //  Determine campaign status based on dates
  const now = new Date();
  const start = campaign.startDate ? new Date(campaign.startDate) : null;
  const end = campaign.endDate ? new Date(campaign.endDate) : null;

  let status = "Draft";
  let color = "rgba(158,158,158,0.8)"; // gray

  if (start && now < start) {
    status = "Upcoming";
    color = "rgba(255, 193, 7, 0.9)"; // yellow
  } else if (start && end && now >= start && now <= end) {
    status = "Open";
    color = "rgba(76, 175, 80, 0.9)"; // green
  } else if (end && now > end) {
    status = "Closed";
    color = "rgba(244, 67, 54, 0.9)"; // red
  }

  return (
    <StyledCard
      onClick={() => onClick && onClick(campaign.id)}
      variant="outlined"
    >
      {/* === Ảnh chiến dịch + trạng thái === */}
      <Box sx={{ position: "relative"}}>
        <CardMedia
          component="img"
          alt={campaign.title}
          image={
            campaign?.bannerUrl
              ? `http://localhost:8081/storage/project-banners/${campaign.bannerUrl}`
              : "https://picsum.photos/800/450?random=2"
          }
          sx={{
            height: { xs: 200, md: 180 },
            objectFit: "cover",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <StatusBadge color={color}>{status}</StatusBadge>
      </Box>

      {/* === Nội dung === */}
      <StyledCardContent>
        <Typography
          variant="caption"
          color="primary"
          sx={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          {campaign ? campaign?.campaignType?.name : "No tag"}
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

        <Description>
          {parse(campaign.description) || "No description available."}
        </Description>

        {/* === Ngày bắt đầu - kết thúc === */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontSize: "0.8rem" }}
        >
          <strong>Start:</strong> {start ? start.toLocaleDateString() : "—"}{" "}
          &nbsp;•&nbsp;
          <strong>End:</strong> {end ? end.toLocaleDateString() : "—"}
        </Typography>

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

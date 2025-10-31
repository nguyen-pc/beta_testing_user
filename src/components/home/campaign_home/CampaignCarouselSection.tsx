import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import CampaignCard from "./CampaignCard";
import { useNavigate } from "react-router-dom";

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: -30,
        transform: "translateY(-50%)",
        color: "#1976d2",
        backgroundColor: "white",
        boxShadow: 1,
        "&:hover": { backgroundColor: "#e3f2fd" },
      }}
    >
      <ArrowForwardIosIcon fontSize="small" />
    </IconButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: -30,
        transform: "translateY(-50%)",
        color: "#1976d2",
        backgroundColor: "white",
        boxShadow: 1,
        "&:hover": { backgroundColor: "#e3f2fd" },
      }}
    >
      <ArrowBackIosNewIcon fontSize="small" />
    </IconButton>
  );
};

const CampaignCarouselSection = ({
  title,
  campaigns,
}: {
  title: string;
  campaigns: any[];
}) => {

    const navigate = useNavigate();

  const handleDetailClick = (campaignId) => {
    console.log("Campaign ID:", campaignId);
    navigate(`/home/detail/${campaignId}`);
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2, // số lượng card hiển thị
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid sx={{ display: "flex" }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          {title.split(" ")[0]}{" "}
        <span style={{ color: "#1976d2" }}>{title.split(" ")[1]}</span>
          {/* {title} */}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 3, ml: 3 }}>
          View All Campaigns
        </Button>
      </Grid>

      <Box sx={{ position: "relative" }}>
        <Slider {...settings}>
          {campaigns.map((c) => (
            <Box key={c.id} sx={{ px: 1 }}>
              <CampaignCard onClick={() => handleDetailClick(c.id)} campaign={c} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

export default CampaignCarouselSection;

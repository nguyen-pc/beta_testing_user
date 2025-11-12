import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";

const NextArrow = ({ onClick }: any) => (
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

const PrevArrow = ({ onClick }: any) => (
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

/** ✨ Carousel Section hiển thị Project với motion và slider */
const ProjectCarouselSection = ({
  title,
  projects,
}: {
  title: string;
  projects: any[];
}) => {
  const navigate = useNavigate();

  const handleDetailClick = (projectId: number | string) => {
    console.log("Project ID:", projectId);
    navigate(`/home/project/${projectId}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            {title.split(" ")[0]}{" "}
            <span style={{ color: "#1976d2" }}>{title.split(" ")[1]}</span>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "9999px",
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/home/projects")}
          >
            View All Projects
          </Button>
        </Grid>

        <Box sx={{ position: "relative" }}>
          <Slider {...settings}>
            {projects.map((p, index) => (
              <Box key={p.id} sx={{ px: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard
                    project={p}
                    index={index}
                    onClick={() => handleDetailClick(p.id)}
                  />
                </motion.div>
              </Box>
            ))}
          </Slider>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProjectCarouselSection;

import * as React from "react";
import { Card, CardContent, CardMedia, Typography, Box, Avatar, AvatarGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "all 0.3s",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

interface Author {
  name: string;
  avatar: string;
}

interface ProjectCardProps {
  project: {
    id: number | string;
    projectName: string;
    description?: string;
    tag?: string;
    image?: string;
    authors?: Author[];
    startDate?: string;
  };
  index?: number;
  onClick?: (id: number | string) => void;
}

/** ✨ ProjectCard with motion + styled MUI */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      <StyledCard onClick={() => onClick?.(project.id)}>
        <CardMedia
          component="img"
          alt={project.projectName}
          image={project.image || "https://picsum.photos/800/450?random=10"}
          sx={{ height: 180, objectFit: "cover" }}
        />

        <StyledCardContent>
          <Typography variant="caption" color="primary">
            {project.tag || "No tag"}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {project.projectName}
          </Typography>
          <StyledTypography color="text.secondary">
            {project.description || "No description available"}
          </StyledTypography>
        </StyledCardContent>

        {project.authors && project.authors.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              pb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AvatarGroup max={3}>
                {project.authors.map((a, i) => (
                  <Avatar key={i} alt={a.name} src={a.avatar} sx={{ width: 24, height: 24 }} />
                ))}
              </AvatarGroup>
              <Typography variant="caption">
                {project.authors.map((a) => a.name).join(", ")}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {project.startDate || ""}
            </Typography>
          </Box>
        )}
      </StyledCard>
    </motion.div>
  );
};

export default ProjectCard;

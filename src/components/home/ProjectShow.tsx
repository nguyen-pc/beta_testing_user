import React from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { callDeleteProject, callGetProject } from "../../config/api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCampaignByProject } from "../../redux/slice/CampaignSlide";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import parse from "html-react-parser";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

function Author({
  authors,
  date,
}: {
  authors: { name: string; avatar: string }[];
  date: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption">{date}</Typography>
    </Box>
  );
}

export default function ProjectShow() {
  const [open, setOpen] = React.useState(false);

  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const campaigns = useAppSelector((state) => state.campaign.result);

  const buildQuery = (params, sort, filter) => {
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: "",
    };

    const clone = { ...params };
    if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
    if (clone.salary) parts.push(`salary ~ '${clone.salary}'`);
    if (clone?.level?.length) {
      parts.push(`${sfIn("level", clone.level).toString()}`);
    }

    if (!q.filter) delete q.filter;
    let temp = queryString.stringify(q);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
    }
    if (sort && sort.salary) {
      sortBy =
        sort.salary === "ascend" ? "sort=salary,asc" : "sort=salary,desc";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend"
          ? "sort=createdAt,asc"
          : "sort=createdAt,desc";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend"
          ? "sort=updatedAt,asc"
          : "sort=updatedAt,desc";
    }

    if (!sortBy) {
      temp = `${temp}&sort=updatedAt,desc`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  // Gọi fetchUser ban đầu
  React.useEffect(() => {
    const initialQuery = buildQuery({ current: 1, pageSize: 15 }, {}, {});
    dispatch(fetchCampaignByProject({ id: projectId, query: initialQuery }));
  }, []);

  console.log("Campaigns in MainProject:", campaigns);

  const fetchProject = async (id) => {
    try {
      const res = await callGetProject(id);
      setProject(res.data);
      console.log("Fetched project:", res.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };
  console.log("Project ID from URL:", projectId);
  React.useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);
  console.log("Project data:", project);

  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleDetailClick = (projectId, campaignId) => {
    console.log("Project ID:", projectId);
    navigate(`/home/detail/${campaignId}`);
  };

  const handleClick = () => {
    console.info("You clicked the filter chip.");
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProject = async () => {
    try {
      await callDeleteProject(projectId);
      setOpen(false);
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Project?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this project? The projects related
            to the project are deleted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDeleteProject} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={6} alignItems="center">
        {/* === Bên phải: Banner === */}
        <Grid item size={{ xs: 12, md: 12, lg: 12 }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            <Box
              component="img"
              src={
                project?.bannerUrl
                  ? `http://localhost:8081/storage/project-banners/${project.bannerUrl}`
                  : "https://picsum.photos/800/450?random=5"
              }
              alt={project?.projectName}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 3,
                objectFit: "cover",
              }}
            />

            {/* overlay gradient */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            />

            {/* Tên project nổi trên ảnh */}
            <Typography
              variant="h5"
              sx={{
                position: "absolute",
                bottom: 16,
                left: 20,
                color: "#fff",
                fontWeight: 600,
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              {project?.projectName}
            </Typography>
          </Box>
        </Grid>
        {/* Bên trái - nội dung */}
        <Grid item size={{ xs: 12, md: 12, lg: 12 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {project ? project.description : "Loading project description..."}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button onClick={() => {}} variant="contained" size="large">
              View company profile
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box>
        <div className="mb-3 mt-10">
          <Typography variant="h5" component="h2">
            Campaign
          </Typography>
        </div>
        <Grid container spacing={2} columns={12}>
          {campaigns &&
            campaigns.map((campaign, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={campaign.id}>
                <StyledCard
                  onClick={() => handleDetailClick(projectId, campaign.id)}
                  variant="outlined"
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  tabIndex={0}
                  className={focusedCardIndex === index ? "Mui-focused" : ""}
                  sx={{ height: "100%" }}
                >
                  <CardMedia
                    component="img"
                    alt={campaign.title}
                    image={
                      campaign?.bannerUrl
                        ? `http://localhost:8081/storage/project-banners/${campaign.bannerUrl}`
                        : "https://picsum.photos/800/450?random=2"
                    }
                    sx={{
                      height: { sm: "auto", md: "50%" },
                      aspectRatio: { sm: "16 / 9", md: "" },
                    }}
                  />
                  <StyledCardContent>
                    <Typography gutterBottom variant="caption" component="div">
                      {campaign?.campaignType?.name
                        ? campaign?.campaignType?.name
                        : "No tag"}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      {campaign.title}
                    </Typography>
                    <StyledTypography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {parse(campaign.description)}
                    </StyledTypography>
                  </StyledCardContent>
                  <Author
                    authors={campaign.authors ? campaign.authors : []}
                    date={campaign.startDate ? campaign.startDate : ""}
                  />
                </StyledCard>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
}

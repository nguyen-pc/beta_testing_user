import * as React from "react";
import {
  Box,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  callFetchAllProjects,
  callGetCampaignActive,
  callGetCampaignUpcoming,
} from "../../config/api";

import Hero from "./Hero";
import CampaignCarouselSection from "./campaign_home/CampaignCarouselSection";
import ProjectCarouselSection from "./campaign_home/ProjectCarouselSection";

export default function MainProject() {
  const [projects, setProjects] = React.useState([]);
  const [activeCampaigns, setActiveCampaigns] = React.useState([]);
  const [upcomingCampaigns, setUpcomingCampaigns] = React.useState([]);
  const [filteredActive, setFilteredActive] = React.useState([]);
  const [filteredUpcoming, setFilteredUpcoming] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch dữ liệu
  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [p, active, upcoming] = await Promise.all([
          callFetchAllProjects("page=1&size=15&sort=updatedAt,desc"),
          callGetCampaignActive(),
          callGetCampaignUpcoming(),
        ]);

        const projectList = p.data?.result || [];
        const activeList = active.data?.result || [];
        console.log("Active Campaigns:", active);
        const upcomingList = upcoming.data?.result || [];

        setProjects(projectList);
        setActiveCampaigns(activeList);
        setUpcomingCampaigns(upcomingList);
        setFilteredActive(activeList);
        setFilteredUpcoming(upcomingList);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 🔹 Danh sách campaign type
  const campaignTypes = [
    "All",
    "Web",
    "Mobile App",
    "Game",
    "AI Product",
    "Other",
  ];

  // 🔹 Chuẩn hóa type
  const normalizeType = (c) =>
    String(c?.campaignType?.name || c?.campaignType || "").toLowerCase();

  // 🔹 Lọc theo type
  const handleFilterByType = (type) => {
    setSelectedType(type);
    const match = type.toLowerCase();

    const filterByType = (arr) =>
      match === "all" ? arr : arr.filter((c) => normalizeType(c) === match);

    setFilteredActive(filterByType(activeCampaigns));
    setFilteredUpcoming(filterByType(upcomingCampaigns));
  };

  // 🔹 Tìm kiếm + Lọc
  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);

    const searchFilter = (arr) => {
      let filtered = [...arr];

      if (selectedType !== "All") {
        filtered = filtered.filter(
          (c) => normalizeType(c) === selectedType.toLowerCase()
        );
      }

      if (q.trim() !== "") {
        filtered = filtered.filter(
          (c) =>
            String(c.title || "")
              .toLowerCase()
              .includes(q) ||
            String(c.description || "")
              .toLowerCase()
              .includes(q)
        );
      }

      return filtered;
    };

    setFilteredActive(searchFilter(activeCampaigns));
    setFilteredUpcoming(searchFilter(upcomingCampaigns));
  };

  return (
    <>
      <Hero />
      <Box sx={{ py: 8 }}>
        <Container>
          {/* ===== Search + Chips cùng hàng ===== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
                mb: 5,
              }}
            >
              {/* Search box */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FormControl sx={{ width: { xs: "100%", sm: "25ch" } }}>
                  <OutlinedInput
                    size="small"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={handleSearch}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <IconButton size="small" aria-label="RSS feed">
                  <RssFeedRoundedIcon />
                </IconButton>
              </Box>

              {/* Chip filter */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.2,
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  flex: 1,
                }}
              >
                {campaignTypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    clickable
                    onClick={() => handleFilterByType(type)}
                    variant={selectedType === type ? "filled" : "outlined"}
                    color={selectedType === type ? "primary" : "default"}
                    sx={{ fontSize: "0.85rem" }}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* ===== Loading ===== */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* ===== Projects Section ===== */}
              {projects.length > 0 && (
                <ProjectCarouselSection
                  title="Recent Projects"
                  projects={projects}
                />
              )}

              {/* ===== Filtered Campaign Sections ===== */}
              {filteredActive.length > 0 && (
                <CampaignCarouselSection
                  title="Recent Campaigns"
                  campaigns={filteredActive}
                />
              )}

              {filteredUpcoming.length > 0 && (
                <CampaignCarouselSection
                  title="Upcoming Campaigns"
                  campaigns={filteredUpcoming}
                />
              )}

              {filteredActive.length === 0 &&
                filteredUpcoming.length === 0 &&
                !loading && (
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ py: 10 }}
                  >
                    No campaigns found for this type or search query.
                  </Typography>
                )}
            </>
          )}
          {/* === HOW IT WORKS === */}
          <Container maxWidth="lg" sx={{ py: 10 }}>
            <Typography variant="h4" fontWeight={700} align="center" mb={6}>
              How It Works
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  step: "1️⃣",
                  title: "Sign Up & Verify Profile",
                  desc: "Create your tester account and complete your profile to get matched with the right campaigns.",
                },
                {
                  step: "2️⃣",
                  title: "Browse & Apply for Campaigns",
                  desc: "Explore active campaigns that match your skills and apply with one click.",
                },
                {
                  step: "3️⃣",
                  title: "Wait for Approval & Access Dashboard",
                  desc: "Once approved by the company, view campaign details and assigned test cases in your dashboard.",
                },
                {
                  step: "4️⃣",
                  title: "Test, Report & Earn Rewards",
                  desc: "Execute test scenarios, submit bug reports and surveys, then receive your reward upon completion.",
                },
              ].map((item, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.2 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl w-[500px] h-[250px]">
                      <CardContent sx={{ textAlign: "center", py: 5 }}>
                        <Typography
                          variant="h2"
                          color="primary"
                          fontWeight={700}
                        >
                          {item.step}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mt: 2 }}
                        >
                          {item.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          {item.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Container>
      </Box>
    </>
  );
}

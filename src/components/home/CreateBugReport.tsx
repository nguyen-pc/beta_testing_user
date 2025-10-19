import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { callCreateBugReport, callGetBugTypes } from "../../config/api";
import ReactQuill from "react-quill";
import UserBugReportList from "./UserBugReportList";

interface BugType {
  id: number;
  name: string;
  description: string;
}

interface CreateBugReportProps {
  campaignId: number;
  onSuccess?: () => void;
}

export default function CreateBugReport({
  campaignId,
  onSuccess,
}: CreateBugReportProps) {
  const user = useAppSelector((s) => s.account.user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
    priority: "",
    stepsToReproduce: "",
    expectedResult: "",
    actualResult: "",
    bugTypeId: "",
  });

  const [bugTypes, setBugTypes] = useState<BugType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBugTypes, setLoadingBugTypes] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load bug types khi component mount
  useEffect(() => {
    const loadBugTypes = async () => {
      setLoadingBugTypes(true);
      try {
        const res = await callGetBugTypes();
        const data = res.data.data || res.data; // fallback nếu backend không bọc "data"
        setBugTypes(data);
      } catch (err) {
        console.warn("Failed to load bug types:", err);
      } finally {
        setLoadingBugTypes(false);
      }
    };
    loadBugTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const payload = {
        ...formData,
        testerId: user?.id,
        assigneeId: null,
        campaignId,
        status: "IN_PROGRESS",
      };
      console.log("Submitting bug report with payload:", payload);

      const res = await callCreateBugReport(payload);
      console.log("Bug report created:", res.data);
      setReloadFlag((prev) => !prev);

      setMessage({
        type: "success",
        text: "Bug report submitted successfully!",
      });
      if (onSuccess) onSuccess();

      // Reset form
      setFormData({
        title: "",
        description: "",
        severity: "",
        priority: "",
        stepsToReproduce: "",
        expectedResult: "",
        actualResult: "",
        bugTypeId: "",
        assigneeId: "",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to submit bug report.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "#fff",
          // maxWidth: "850px",
          mx: "auto",
          my: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 2, color: "primary.main" }}
        >
          Report a New Bug
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <Typography className="mb-2">Description</Typography>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(value) =>
              handleChange({ target: { name: "description", value } })
            }
            style={{
              width: "100%",
              height: "150px",
              marginBottom: "50px",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          />

          {/* Dropdown chọn Bug Type */}

          <TextField
            select
            label="Bug Type"
            name="bugTypeId"
            value={formData.bugTypeId}
            onChange={handleChange}
            fullWidth
            disabled={loadingBugTypes}
            helperText={
              loadingBugTypes
                ? "Loading bug types..."
                : bugTypes.length === 0
                ? "No bug types available"
                : "Select a bug type"
            }
          >
            {bugTypes.map((bt) => (
              <MenuItem key={bt.id} value={bt.id}>
                {bt.name}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="MINOR">MINOR</MenuItem>
              <MenuItem value="MAJOR">MAJOR</MenuItem>
              <MenuItem value="CRITICAL">CRITICAL</MenuItem>
              <MenuItem value="TRIVIAL">TRIVIAL</MenuItem>
            </TextField>

            <TextField
              select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
            </TextField>
          </Stack>

          {/* <TextField
          label="Steps to Reproduce"
          name="stepsToReproduce"
          value={formData.stepsToReproduce}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        /> */}
          <Typography className="mb-2">Steps to Reproduce</Typography>
          <ReactQuill
            theme="snow"
            value={formData.stepsToReproduce}
            onChange={(value) =>
              handleChange({ target: { name: "stepsToReproduce", value } })
            }
            style={{
              width: "100%",
              height: "150px",
              marginBottom: "50px",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          />

          <TextField
            label="Expected Result"
            name="expectedResult"
            value={formData.expectedResult}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Actual Result"
            name="actualResult"
            value={formData.actualResult}
            onChange={handleChange}
            fullWidth
          />

          {message && (
            <Alert severity={message.type} sx={{ mt: 1 }}>
              {message.text}
            </Alert>
          )}

          <Box maxWidth="850px">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              maxWidth="200px"
              sx={{ py: 1.5, fontWeight: 600 }}
              startIcon={loading && <CircularProgress size={18} />}
            >
              {loading ? "Submitting..." : "Submit Bug"}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mt: 6 }}>
        <UserBugReportList
          campaignId={Number(campaignId)}
          reload={reloadFlag}
        />
      </Box>
    </>
  );
}

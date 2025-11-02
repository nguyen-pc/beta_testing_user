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
  Dialog,
  IconButton,
} from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import {
  callCreateBugReport,
  callGetBugTypes,
  uploadFileBug,
  callCreateBugReportDevice, // 🧩 import thêm
} from "../../config/api";
import ReactQuill from "react-quill";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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

  // 🧩 Form thiết bị
  const [deviceData, setDeviceData] = useState({
    device: "",
    os: "",
    browser: "",
  });

  const [bugTypes, setBugTypes] = useState<BugType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBugTypes, setLoadingBugTypes] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // File upload tạm
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadBugTypes = async () => {
      setLoadingBugTypes(true);
      try {
        const res = await callGetBugTypes();
        const data = res.data.data || res.data;
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

  const handleDeviceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDeviceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...tempFiles];
    newFiles.splice(index, 1);
    setTempFiles(newFiles);
  };

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  // 🧠 Submit bug + upload file + upload device
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

      // 1️⃣ Tạo bug report
      const res = await callCreateBugReport(payload);
      const newBugId = res.data.data?.id || res.data.id;
      console.log("✅ Bug created:", newBugId);

      // 2️⃣ Upload file
      if (tempFiles.length > 0 && newBugId) {
        for (const file of tempFiles) {
          await uploadFileBug(file, newBugId, user.id);
          console.log("Uploaded file:", file.name);
        }
      }

      // 3️⃣ Upload device info
      if (
        newBugId &&
        (deviceData.device || deviceData.os || deviceData.browser)
      ) {
        await callCreateBugReportDevice({
          bugId: newBugId,
          device: deviceData.device,
          os: deviceData.os,
          browser: deviceData.browser,
        });
        console.log("✅ Uploaded device info:", deviceData);
      }

      setMessage({
        type: "success",
        text: "Bug report submitted successfully!",
      });
      setTempFiles([]);
      setDeviceData({ device: "", os: "", browser: "" });
      setReloadFlag((prev) => !prev);
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
          {/* ======================= BUG INFO ======================= */}
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

          <TextField
            select
            label="Bug Type"
            name="bugTypeId"
            value={formData.bugTypeId}
            onChange={handleChange}
            fullWidth
            disabled={loadingBugTypes}
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

          {/* ======================= DEVICE INFO ======================= */}
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight={600} mb={1}>
              Device Information
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Device"
                name="device"
                value={deviceData.device}
                onChange={handleDeviceChange}
                fullWidth
              />
              <TextField
                label="OS"
                name="os"
                value={deviceData.os}
                onChange={handleDeviceChange}
                fullWidth
              />
              <TextField
                label="Browser"
                name="browser"
                value={deviceData.browser}
                onChange={handleDeviceChange}
                fullWidth
              />
            </Stack>
          </Box>

          {/* ======================= ATTACHMENTS ======================= */}
          <Box>
            <Typography fontWeight={600} mb={1}>
              Attachments
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Choose Files
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*,.pdf,.zip,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files) setTempFiles(Array.from(e.target.files));
                }}
              />
            </Button>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              {tempFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>

                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      onClick={() => handlePreview(file)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: "center",
                        p: 1,
                        width: "100%",
                        overflow: "hidden",
                      }}
                      onClick={() => handlePreview(file)}
                    >
                      {file.name}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          {message && <Alert severity={message.type}>{message.text}</Alert>}

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{ py: 1.5, fontWeight: 600 }}
              startIcon={loading && <CircularProgress size={18} />}
            >
              {loading ? "Submitting..." : "Submit Bug"}
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* 🔍 Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <Box sx={{ position: "relative", p: 2, bgcolor: "#000" }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          {previewUrl?.match(/\.(mp4|webm)$/i) ? (
            <video
              controls
              src={previewUrl}
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          ) : (
            <img
              src={previewUrl || ""}
              alt="preview"
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          )}
        </Box>
      </Dialog>

      <Box sx={{ mt: 6 }}>
        <UserBugReportList
          campaignId={Number(campaignId)}
          reload={reloadFlag}
        />
      </Box>
    </>
  );
}

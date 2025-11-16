import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  callGetAttachmentsByBugId,
  callGetBugReportDevice,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import parse from "html-react-parser";

interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string | null;
  uploadedAt: string;
  uploaderName: string;
}

interface DeviceInfo {
  id: number;
  device: string;
  os: string;
  browser: string;
  createdAt: string;
  bugId: number;
}

interface BugDetailDialogProps {
  open: boolean;
  onClose: () => void;
  bug: any;
}

export default function BugDetailDialog({
  open,
  onClose,
  bug,
}: BugDetailDialogProps) {
  const user = useAppSelector((s) => s.account.user);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchAttachments = async () => {
    if (!bug?.id) return;
    setLoadingFiles(true);
    try {
      const res = await callGetAttachmentsByBugId(bug.id);
      const data = res.data.data || res.data;
      setAttachments(data || []);
    } catch (err) {
      console.error("Failed to load attachments:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchDeviceInfo = async () => {
    if (!bug?.id) return;
    setLoadingDevice(true);
    try {
      const res = await callGetBugReportDevice(String(bug.id));
      const data = res.data.data || res.data;
      setDeviceInfo(data || []);
    } catch (err) {
      console.error("Failed to load device info:", err);
    } finally {
      setLoadingDevice(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAttachments();
      fetchDeviceInfo();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Bug Detail — {bug?.title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {bug ? (
          <Box>
            {/* ==================== BUG META ==================== */}
            <Stack direction="row" spacing={1} mb={1}>
              <Chip
                label={bug.severity}
                color={
                  bug.severity === "CRITICAL"
                    ? "error"
                    : bug.severity === "MAJOR"
                    ? "warning"
                    : "info"
                }
              />
              <Chip label={bug.priority} variant="outlined" />
              <Chip label={bug.status || "PENDING"} color="primary" />
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Description:
            </Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: bug.description }}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" fontWeight="bold">
              Steps to Reproduce:
            </Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: bug.stepsToReproduce }}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2">
              <strong>Expected Result:</strong> {parse(bug.expectedResult)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Actual Result:</strong> {bug.actualResult}
            </Typography>

            {/* ==================== DEVICE INFO ==================== */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Device Information
            </Typography>

            {loadingDevice ? (
              <CircularProgress size={24} />
            ) : deviceInfo.length === 0 ? (
              <Alert severity="info" sx={{ mt: 1 }}>
                No device info provided for this bug.
              </Alert>
            ) : (
              deviceInfo.map((d) => (
                <Box
                  key={d.id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    mb: 1.5,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      <strong>Device:</strong> {d.device || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>OS:</strong> {d.os || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Browser:</strong> {d.browser || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Added: {new Date(d.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>
              ))
            )}

            {/* ==================== ATTACHMENTS ==================== */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Attachments
            </Typography>

            {loadingFiles ? (
              <CircularProgress />
            ) : attachments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No attachments uploaded for this bug.
              </Typography>
            ) : (
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {attachments.map((file) => {
                  const fileUrl =
                    file.fileUrl ||
                    `${import.meta.env.VITE_BACKEND_URL}/storage/attachment/${
                      file.fileName
                    }`;

                  const previewable =
                    file.fileType?.startsWith("image/") ||
                    file.fileType?.startsWith("video/");

                  return (
                    <Box
                      key={file.id}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => previewable && setPreviewUrl(fileUrl)}
                    >
                      {file.fileType?.startsWith("image/") ? (
                        <img
                          src={fileUrl}
                          alt={file.fileName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : file.fileType?.startsWith("video/") ? (
                        <video
                          src={fileUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{ height: "100%", p: 1 }}
                        >
                          <Typography variant="caption">
                            {file.fileName}
                          </Typography>
                          <Button
                            size="small"
                            href={fileUrl}
                            target="_blank"
                            sx={{ mt: 0.5 }}
                          >
                            Download
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        ) : (
          <Typography>No bug selected.</Typography>
        )}
      </DialogContent>

      {/* 🔍 Preview fullscreen */}
      {previewUrl && (
        <Dialog
          open={!!previewUrl}
          onClose={() => setPreviewUrl(null)}
          fullWidth
          maxWidth="lg"
        >
          <Box sx={{ position: "relative", bgcolor: "#000", p: 2 }}>
            <IconButton
              onClick={() => setPreviewUrl(null)}
              sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
            >
              <CloseIcon />
            </IconButton>

            {previewUrl.match(/\.(mp4|webm)$/i) ? (
              <video
                controls
                src={previewUrl}
                style={{ width: "100%", maxHeight: "80vh" }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        </Dialog>
      )}
    </Dialog>
  );
}

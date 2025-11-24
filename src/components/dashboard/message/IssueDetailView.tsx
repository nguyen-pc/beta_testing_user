import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Avatar,
  Chip,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  CircularProgress,
  Dialog,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import {
  callGetBugByUser,
  callGetDetailBugReport,
  callGetAttachmentsByBugId,
  callGetBugReportDevice,
  uploadRecording,
} from "../../../config/api";
import { useBugChat } from "../../../hooks/websocket/useBugChat";
import { useAppSelector } from "../../../redux/hooks";
import { formatChatTime } from "../../../util/timeFormatter";
import parse from "html-react-parser";

interface Issue {
  id: number;
  title: string;
  description: string;
  expectedResult: string;
  actualResult: string;
  priority: string;
  severity: string;
  status: string;
  testerUserName: string;
  assigneeName: string;
}

interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string | null;
  uploadedAt: string;
}

interface DeviceInfo {
  id: number;
  device: string;
  os: string;
  browser: string;
  createdAt: string;
  bugId: number;
}

export default function IssueDetailView() {
  const user = useAppSelector((state) => state.account.user);

  // ---------------- State ----------------
  const [issue, setIssue] = useState<Issue | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [relatedIssues, setRelatedIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [selectedBugId, setSelectedBugId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  let campaignId = 0;

  // ✅ Chat realtime hook
  const { messages, sendMessage, connected } = useBugChat(selectedBugId);

  // ---------------- Fetch Issue Detail ----------------
  const fetchIssueDetail = async (id: number) => {
    setLoading(true);
    try {
      const res = await callGetDetailBugReport(id);
      setIssue(res.data);
    } catch (err) {
      console.error("Error fetching issue detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Attachments ----------------
  const fetchAttachments = async (bugId: number) => {
    setLoadingFiles(true);
    try {
      const res = await callGetAttachmentsByBugId(bugId);
      const data = res.data.data || res.data;
      setAttachments(data || []);
    } catch (err) {
      console.error("Error fetching attachments:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // ---------------- Fetch Device Info ----------------
  const fetchDeviceInfo = async (bugId: number) => {
    setLoadingDevice(true);
    try {
      const res = await callGetBugReportDevice(String(bugId));
      const data = res.data.data || res.data;
      setDeviceInfo(data || []);
    } catch (err) {
      console.error("Error fetching device info:", err);
    } finally {
      setLoadingDevice(false);
    }
  };

  // ---------------- Fetch Related Issues ----------------
  const fetchRelatedIssues = async () => {
    if (!user?.id) return;
    try {
      const res = await callGetBugByUser(user.id);
      campaignId = res.data.result[0]?.campaignId || 0;
      const list = res.data?.result || res.data?.data || [];
      setRelatedIssues(list);
    } catch (err) {
      console.error("Error fetching related issues:", err);
    }
  };

  // ---------------- Lifecycle ----------------
  useEffect(() => {
    fetchRelatedIssues();
  }, []);

  useEffect(() => {
    if (selectedBugId) {
      fetchIssueDetail(selectedBugId);
      fetchAttachments(selectedBugId);
      fetchDeviceInfo(selectedBugId);
    }
  }, [selectedBugId]);

  // ---------------- Handle send message ----------------
  const handleSend = () => {
    if (!newMsg.trim() || !selectedBugId) return;
    sendMessage(newMsg, user.id, selectedBugId);
    setNewMsg("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const folderType = campaignId;
      const uploader = user.id;
      const res = await uploadRecording(file, folderType, uploader);

      const fileName = res.data?.fileName;
      if (fileName) {
        const fileUrl = `http://localhost:8081/storage/${folderType}/${fileName}`;
        sendMessage(`${fileUrl}`, user.id, selectedBugId);
      }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("Upload file failed!");
    }
  };

  // ===========================================================
  // ======================= RENDER UI ==========================
  // ===========================================================
  return (
    <Box display="flex" height="calc(100vh - 100px)">
      {/* 🧭 LEFT SIDEBAR */}
      <Box
        width="28%"
        borderRight="1px solid #ddd"
        p={2}
        sx={{
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        <Typography fontWeight={600} variant="subtitle1" mb={1}>
          Related Issues
        </Typography>

        <TextField
          size="small"
          fullWidth
          placeholder="Search"
          variant="outlined"
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {relatedIssues.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No related issues
          </Typography>
        ) : (
          <Stack spacing={1}>
            {relatedIssues
              .filter((bug) =>
                (bug.title ?? "")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((bug) => (
                <Paper
                  key={bug.id}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor:
                      selectedBugId === bug.id
                        ? "primary.light"
                        : "transparent",
                    color: selectedBugId === bug.id ? "white" : "text.primary",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                  onClick={() => setSelectedBugId(bug.id)}
                >
                  <Typography fontSize={13} fontWeight={500}>
                    {bug.title}
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    {bug.status} • {bug.priority}
                  </Typography>
                </Paper>
              ))}
          </Stack>
        )}
      </Box>

      {/* 🧩 MAIN AREA */}
      {!selectedBugId ? (
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography color="text.secondary">
            Hãy chọn một bug để xem chi tiết.
          </Typography>
        </Box>
      ) : loading ? (
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 🧩 MIDDLE CONTENT */}
          <Box
            flex={1.5}
            borderRight="1px solid #ddd"
            p={3}
            display="flex"
            flexDirection="column"
          >
            {/* TITLE */}
            <Typography variant="h6" fontWeight={600}>
              {issue?.title}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* EXPECTED */}
            <Typography variant="subtitle2" fontWeight={600}>
              Expected
            </Typography>
            <Typography variant="body2" mb={2}>
              {issue?.expectedResult || "—"}
            </Typography>

            {/* ACTUAL */}
            <Typography variant="subtitle2" fontWeight={600}>
              Actual
            </Typography>
            <Typography variant="body2" mb={2}>
              {issue?.actualResult || "—"}
            </Typography>

            {/* DESCRIPTION */}
            <Typography variant="subtitle2" fontWeight={600}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {parse(issue?.description || "")}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* CHAT SCROLL AREA */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0, // ⭐ Quan trọng để tránh double-scroll
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#b5b5b5",
                  borderRadius: 3,
                },
              }}
            >
              <List dense sx={{ pb: 2 }}>
                {messages.map((msg, i) => {
                  const isOwn = msg.senderId === user.id;
                  const content = msg.content.trim();
                  const urlMatch = content.match(/https?:\/\/\S+/);
                  const url = urlMatch ? urlMatch[0] : "";
                  const isFile = !!url;
                  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
                  const isVideo = /\.(mp4|webm)$/i.test(url);

                  return (
                    <ListItem
                      key={i}
                      alignItems="flex-start"
                      sx={{
                        justifyContent: isOwn ? "flex-end" : "flex-start",
                        textAlign: isOwn ? "right" : "left",
                      }}
                    >
                      {!isOwn && (
                        <ListItemAvatar>
                          <Avatar>{msg.senderName?.[0] || "?"}</Avatar>
                        </ListItemAvatar>
                      )}

                      <Paper
                        sx={{
                          p: 1,
                          px: 1.5,
                          maxWidth: "70%",
                          bgcolor: isOwn ? "primary.main" : "grey.100",
                          color: isOwn ? "white" : "text.primary",
                          borderRadius: 2,
                        }}
                      >
                        {isFile ? (
                          isImage ? (
                            <img
                              src={url}
                              alt="attachment"
                              style={{ maxWidth: "100%", borderRadius: 6 }}
                            />
                          ) : isVideo ? (
                            <video
                              src={url}
                              controls
                              style={{ maxWidth: "100%", borderRadius: 6 }}
                            />
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: isOwn ? "#fff" : "inherit" }}
                            >
                              {url}
                            </a>
                          )
                        ) : (
                          <Typography variant="body2">{content}</Typography>
                        )}

                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            opacity: 0.7,
                            mt: 0.5,
                          }}
                        >
                          {msg.createdAt ? formatChatTime(msg.createdAt) : ""}
                        </Typography>
                      </Paper>

                      {isOwn && (
                        <ListItemAvatar sx={{ ml: 1 }}>
                          <Avatar>{user.name?.[0] || "U"}</Avatar>
                        </ListItemAvatar>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            {/* INPUT AREA */}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                bgcolor: "#fff",
                pt: 1.5,
                pb: 1.5,
                borderTop: "1px solid #e0e0e0",
                zIndex: 10,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  p: 1.2,
                  borderRadius: 4,
                  border: "2px solid #c7ccd1",
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                }}
              >
                <TextField
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Nhập tin nhắn…"
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 3,
                      "& fieldset": {
                        border: "1px solid #d0d7de",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8a8f95",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                  }}
                />

                <input
                  type="file"
                  id="chat-file-input"
                  hidden
                  onChange={handleFileUpload}
                />

                <IconButton
                  onClick={() =>
                    document.getElementById("chat-file-input")?.click()
                  }
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #d0d7de",
                    bgcolor: "#fff",
                    width: 42,
                    height: 42,
                    "&:hover": { bgcolor: "#f1f1f1" },
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <IconButton
                  onClick={handleSend}
                  disabled={!connected}
                  sx={{
                    borderRadius: 3,
                    bgcolor: "#1976d2",
                    color: "white",
                    width: 42,
                    height: 42,
                    "&:hover": { bgcolor: "#125ea6" },
                    "&:disabled": {
                      bgcolor: "#9bb9d8",
                      cursor: "not-allowed",
                    },
                  }}
                >
                  <SendIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          {/* 🧱 RIGHT SIDEBAR */}
          <Box width="26%" p={3} overflow="auto">
            <Typography fontWeight={600} variant="subtitle1" mb={1}>
              Bug Details
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Status:</strong> {issue?.status}
              </Typography>
              <Typography variant="body2">
                <strong>Assignee:</strong> {issue?.assigneeName || "Unassigned"}
              </Typography>
              <Typography variant="body2">
                <strong>Priority:</strong> {issue?.priority}
              </Typography>
              <Typography variant="body2">
                <strong>Severity:</strong> {issue?.severity}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={600} variant="subtitle1" mb={1}>
              Device Info
            </Typography>
            {loadingDevice ? (
              <CircularProgress size={24} />
            ) : deviceInfo.length === 0 ? (
              <Alert severity="info" sx={{ mt: 1 }}>
                No device info for this bug.
              </Alert>
            ) : (
              deviceInfo.map((d) => (
                <Box
                  key={d.id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 1.5,
                    mb: 1,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Typography variant="body2">
                    <strong>Device:</strong> {d.device}
                  </Typography>
                  <Typography variant="body2">
                    <strong>OS:</strong> {d.os}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Browser:</strong> {d.browser}
                  </Typography>
                </Box>
              ))
            )}

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={600} variant="subtitle1" mb={1}>
              Attachments
            </Typography>
            {loadingFiles ? (
              <CircularProgress size={24} />
            ) : attachments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No attachments
              </Typography>
            ) : (
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {attachments.map((file) => {
                  const fileUrl =
                    file.fileUrl ||
                    `${import.meta.env.VITE_BACKEND_URL}/storage/attachment/${
                      file.fileName
                    }`;
                  const isImage = file.fileType?.startsWith("image/");
                  const isVideo = file.fileType?.startsWith("video/");

                  return (
                    <Box
                      key={file.id}
                      onClick={() => setPreviewUrl(fileUrl)}
                      sx={{
                        width: 100,
                        height: 100,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={file.fileName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : isVideo ? (
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
                          <Typography
                            variant="caption"
                            textAlign="center"
                            sx={{ px: 1, wordBreak: "break-word" }}
                          >
                            {file.fileName}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        </>
      )}

      {/* 🔍 Preview Dialog */}
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
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
                zIndex: 2,
              }}
            >
              <CloseIcon />
            </IconButton>

            {previewUrl.match(/\.(mp4|webm)$/i) ? (
              <video
                controls
                src={previewUrl}
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
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
    </Box>
  );
}

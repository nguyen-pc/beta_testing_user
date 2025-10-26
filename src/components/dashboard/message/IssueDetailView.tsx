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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  callGetBugByUser,
  callGetDetailBugReport,
  uploadRecording,
} from "../../../config/api";
import { useBugChat } from "../../../hooks/websocket/useBugChat";
import { useAppSelector } from "../../../redux/hooks";
import { formatChatTime } from "../../../util/timeFormatter";

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
  device: string;
  os: string;
  browser: string;
  attachments: string[];
}

export default function IssueDetailView() {
  const user = useAppSelector((state) => state.account.user);

  // ---------------- State ----------------
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [relatedIssues, setRelatedIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [selectedBugId, setSelectedBugId] = useState<number | null>(null);

  let campaignId = 0;

  // ✅ Chat realtime hook (tham số bugId động)
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

      {/* 🧩 MIDDLE + RIGHT CONTENT */}
      {!selectedBugId ? (
        // 🕳️ Khi chưa chọn bug
        <Box
          flex={1}
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          sx={{ p: 4 }}
        >
          <Typography color="text.secondary" fontSize={16}>
            Hãy chọn một bug trong danh sách bên trái để xem chi tiết.
          </Typography>
        </Box>
      ) : loading ? (
        // ⏳ Khi đang tải
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      ) : !issue ? (
        // 🚫 Không tìm thấy bug
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography color="text.secondary">
            Issue not found or has been removed.
          </Typography>
        </Box>
      ) : (
        // ✅ Khi đã chọn bug
        <>
          {/* 🧩 MIDDLE CONTENT */}
          <Box flex={1.5} borderRight="1px solid #ddd" p={3} overflow="auto">
            <Typography variant="h6" fontWeight={600}>
              {issue.title}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Expected
            </Typography>
            <Typography variant="body2" mb={2}>
              {issue.expectedResult || "—"}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Actual
            </Typography>
            <Typography variant="body2" mb={2}>
              {issue.actualResult || "—"}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Attachments
            </Typography>
            <Box mb={2}>
              {issue.attachments?.length ? (
                issue.attachments.map((file, i) => (
                  <Chip
                    key={i}
                    label={file}
                    variant="outlined"
                    sx={{ mr: 1, mt: 1 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No attachments
                </Typography>
              )}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {issue.description || "No description"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* <Typography variant="subtitle2" gutterBottom>
              Internal Notes {connected ? "🟢" : "🔴"}
            </Typography> */}

            <List
              dense
              id="chat-container"
              sx={{ maxHeight: 400, overflowY: "auto", mb: 1 }}
            >
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
                        <Avatar>
                          {msg.senderName ? msg.senderName[0] : "?"}
                        </Avatar>
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
                        sx={{ display: "block", opacity: 0.7 }}
                      >
                        {msg.createdAt ? formatChatTime(msg.createdAt) : ""}
                      </Typography>
                    </Paper>

                    {isOwn && (
                      <ListItemAvatar sx={{ ml: 1 }}>
                        <Avatar>{user.name ? user.name[0] : "U"}</Avatar>
                      </ListItemAvatar>
                    )}
                  </ListItem>
                );
              })}
            </List>

            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              <TextField
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Send a message"
                fullWidth
                size="small"
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
              >
                <AttachFileIcon />
              </IconButton>
              <IconButton
                onClick={handleSend}
                color="primary"
                disabled={!connected}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* 🧱 RIGHT SIDEBAR */}
          <Box width="26%" p={3} overflow="auto">
            <Typography fontWeight={600} variant="subtitle1" mb={1}>
              Bug Details
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Status:</strong> {issue.status}
              </Typography>
              <Typography variant="body2">
                <strong>Assignee:</strong> {issue.assigneeName || "Unassigned"}
              </Typography>
              <Typography variant="body2">
                <strong>Priority:</strong> {issue.priority}
              </Typography>
              <Typography variant="body2">
                <strong>Severity:</strong> {issue.severity}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={600} variant="subtitle1" mb={1}>
              Device Info
            </Typography>
            <Typography variant="body2">Device: {issue.device}</Typography>
            <Typography variant="body2">OS: {issue.os}</Typography>
            <Typography variant="body2">Browser: {issue.browser}</Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

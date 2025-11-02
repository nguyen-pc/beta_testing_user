import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { uploadFileBug, callGetAttachmentsByBugId } from "../../config/api";
import { useAppSelector } from "../../redux/hooks";

interface Props {
  bugId: number;
}

export default function BugAttachmentUploader({ bugId }: Props) {
  const user = useAppSelector((s) => s.account.user);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchAttachments = async () => {
    try {
      const res = await callGetAttachmentsByBugId(bugId);
      setAttachments(res.data.data || []);
    } catch (err) {
      console.error("Failed to load attachments:", err);
    }
  };

  useEffect(() => {
    if (bugId) fetchAttachments();
  }, [bugId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user?.id) return;
    const file = e.target.files[0];
    try {
      await uploadFileBug(file, bugId, user.id);
      await fetchAttachments();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handlePreview = (url: string | null) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  return (
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
        Upload File
        <input
          type="file"
          hidden
          onChange={handleUpload}
          accept="image/*,video/*,.pdf,.zip,.doc,.docx"
        />
      </Button>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        {attachments.map((file) => {
          const previewable = file.fileType?.startsWith("image/") || file.fileType?.startsWith("video/");
          const fileUrl =
            file.fileUrl ||
            `${import.meta.env.VITE_API_BASE_URL}/uploads/attachment/${bugId}/${file.fileName}`;

          return (
            <Box
              key={file.id}
              onClick={() => previewable && handlePreview(fileUrl)}
              sx={{
                width: 100,
                height: 100,
                border: "1px solid #ccc",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: previewable ? "pointer" : "default",
                "&:hover": { borderColor: previewable ? "primary.main" : "#ccc" },
              }}
            >
              {file.fileType?.startsWith("image/") ? (
                <img
                  src={fileUrl}
                  alt={file.fileName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : file.fileType?.startsWith("video/") ? (
                <video
                  src={fileUrl}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography
                  variant="caption"
                  sx={{ textAlign: "center", p: 1 }}
                >
                  {file.fileName}
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>

      {/* 🔍 Preview dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <Box sx={{ position: "relative", p: 2, bgcolor: "#000" }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>

          {previewUrl?.match(/\.(mp4|webm)$/i) ? (
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
              src={previewUrl || ""}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

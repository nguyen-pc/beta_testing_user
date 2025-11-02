import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  uploadRecording,
  callMarkUploadedTesterCampaign,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";

interface FileUploadVideoProps {
  campaignId: number | string;
  initialVideoUrl?: string | null; // 🆕 Thêm để nhận video đã upload
}

export default function FileUploadVideo({
  campaignId,
  initialVideoUrl,
}: FileUploadVideoProps) {
  const user = useAppSelector((state) => state.account.user);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [doneUrl, setDoneUrl] = useState<string | null>(
    initialVideoUrl || null
  );
  const [progress, setProgress] = useState<number>(0);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (initialVideoUrl) setDoneUrl(initialVideoUrl);
  }, [initialVideoUrl]);

  const handleFileSelect = (selected: File) => {
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setDoneUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFileSelect(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleUpload = async () => {
    if (!file) return alert("Vui lòng chọn video để upload!");
    if (!user?.id) return alert("Không xác định được người dùng!");

    try {
      setUploading(true);
      setProgress(10);

      const res = await uploadRecording(file, Number(campaignId), user.id);
      setProgress(70);
      const fileName = res.data?.fileName;
      setDoneUrl(fileName);

      if (fileName) {
        const payload = { userId: user.id, campaignId, fileName };
        await callMarkUploadedTesterCampaign(payload);
        console.log("✅ Đã cập nhật TesterCampaign upload thành công");
      }

      setProgress(100);
    } catch (error) {
      console.error("❌ Lỗi khi upload video:", error);
      alert("Lỗi upload, vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setDoneUrl(null);
    setProgress(0);
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        backgroundColor: "#fafafa",
        maxWidth: "600px",
        mx: "auto",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🎥 Upload your test video
        </Typography>

        {/* 🧩 Nếu đã có video thì hiển thị video thay vì vùng upload */}
        {doneUrl ? (
          <Box sx={{ mt: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" color="success.main" sx={{ mt: 1 }}>
              Video uploaded
            </Typography>

            <video
              controls
              src={
                doneUrl.startsWith("http")
                  ? doneUrl
                  : `http://localhost:8081/storage/${campaignId}/${doneUrl}`
              }
              style={{
                width: "100%",
                marginTop: 12,
                borderRadius: 12,
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              border: `2px dashed ${isDragActive ? "#1976d2" : "#90caf9"}`,
              borderRadius: 3,
              p: 4,
              cursor: "pointer",
              backgroundColor: isDragActive ? "#e3f2fd" : "#f8fbff",
              transition: "0.3s",
              position: "relative",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            onClick={() =>
              document.getElementById("video-upload-input")?.click()
            }
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragActive(true)}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 60,
                color: isDragActive ? "#1976d2" : "#42a5f5",
                transition: "0.2s",
              }}
            />
            <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
              Click or drag your video file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Supported formats: .mp4, .webm, .mov)
            </Typography>

            <input
              id="video-upload-input"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </Box>
        )}

        {uploading && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 5 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Uploading... {progress}%
            </Typography>
          </Box>
        )}
      </CardContent>

      {doneUrl && (
        <CardActions sx={{ justifyContent: "center", mt: 2 }}>
          <IconButton color="primary" onClick={handleReset}>
            <ReplayIcon />
          </IconButton>
        </CardActions>
      )}

      {!doneUrl && (
        <CardActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            disabled={!file || uploading}
            onClick={handleUpload}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              color: "white",
              px: 4,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            }}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

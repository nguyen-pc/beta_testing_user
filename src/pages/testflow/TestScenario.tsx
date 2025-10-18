import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTestFlow } from "./TestFlowProvider";
import {
  callGetCampaign,
  callGetTesterCampaignStatus,
  callMarkUploadedTesterCampaign,
  uploadRecording,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import UseCaseSection from "../../components/home/UseCaseSection";

export default function TestScenario() {
  const { campaignId } = useParams();
  const user = useAppSelector((s) => s.account.user);

  const [campaign, setCampaign] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [joined, setJoined] = React.useState(false);

  const navigate = useNavigate();

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await callGetCampaign(campaignId);

      setCampaign(showData.data);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [campaignId]);
  console.log(campaignId);

  const checkUserStatus = React.useCallback(async () => {
    if (!user?.id || !campaignId) return;
    try {
      const res = await callGetTesterCampaignStatus(user.id, campaignId);
      console.log("Tester status:", res.data);
      if (res.data.exists) {
        setJoined(true); // đã tham gia campaign
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái:", err);
    }
  }, [user, campaignId]);

  React.useEffect(() => {
    loadData();
    checkUserStatus();
  }, [loadData]);
  console.log(campaign);

  // 🧩 State
  const [timer, setTimer] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [doneUrl, setDoneUrl] = useState<string | null>(null);

  const { stopRecording, lastBlob, isRecording } = useTestFlow();

  // 🕒 Đếm thời gian khi đang ghi
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;

    if (isRecording) {
      setTimer(0); // reset timer khi bắt đầu ghi
      id = setInterval(() => setTimer((t) => t + 1), 1000);
    }

    // cleanup khi stop
    return () => {
      if (id) clearInterval(id);
    };
  }, [isRecording]);

  // ⏱ Định dạng mm:ss
  const mmss = useMemo(() => {
    const m = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const s = (timer % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [timer]);

  // 🛑 Stop recording
  const onStop = async () => {
    await stopRecording();
  };

  // ☁️ Upload video
  const onUpload = async () => {
    if (!lastBlob) return;
    setUploading(true);
    try {
      // Test thử

      const file = new File([lastBlob], `recording-${Date.now()}.webm`, {
        type: lastBlob.type,
      });
      const res = await uploadRecording(file, Number(campaignId), user?.id);
      setDoneUrl(res.data?.fileName || "Uploaded successfully!");
      console.log("Kết quả upload:", res, campaignId, user?.id, doneUrl);

      if (res.data?.fileName) {
        // 🟢 2️⃣ Cập nhật trạng thái upload cho TesterCampaign
        const payload = {
          userId: user.id,
          campaignId,
          fileName: res.data?.fileName,
        };
        console.log("Gọi callMarkUploadedTesterCampaign với payload:", payload);
        const resUpdateStatus = await callMarkUploadedTesterCampaign(payload);
        console.log("Kết quả cập nhật TesterCampaign:", resUpdateStatus);
        console.log("✅ Đã cập nhật TesterCampaign upload thành công");
      } else {
        console.warn("⚠️ Không có fileName trả về từ uploadRecording");
      }

      navigate(`/testflow/${campaignId}/bug_report`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">Scenario</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>⏱ {mmss}</Typography>
          {isRecording ? (
            <Button variant="outlined" color="error" onClick={onStop}>
              Stop
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onUpload}
              disabled={!lastBlob || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Hướng dẫn */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#f7f7fb" : "#1f1f24"),
        }}
      >
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          For this test:
        </Typography>
        <Typography>
          • Open the product page in a new tab and try to complete the given
          tasks.
        </Typography>
        <Typography>• Speak aloud why you click or hesitate.</Typography>
      </Box>
      <UseCaseSection useCases={campaign?.useCases || []} />

      {/* Thông báo sau khi stop */}
      {!isRecording && lastBlob && (
        <>
          <Alert severity="success" sx={{ mt: 2 }}>
            ✅ Recording finished. Preview your video below before uploading.
          </Alert>

          {/* 🎥 Video Preview */}
          <Box
            sx={{
              mt: 2,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              bgcolor: "#000",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{ mb: 1, color: "#fff", p: 1, bgcolor: "primary.main" }}
            >
              Preview your recording:
            </Typography>
            <video
              controls
              style={{ width: "100%", borderRadius: "0 0 8px 8px" }}
              src={URL.createObjectURL(lastBlob)}
            />
          </Box>
        </>
      )}

      {/* Sau khi upload */}
      {doneUrl && (
        <Alert severity="info" sx={{ mt: 2 }}>
          📤 Uploaded: {doneUrl}
        </Alert>
      )}
    </Container>
  );
}

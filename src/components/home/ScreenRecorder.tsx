import React, { useState, useRef } from "react";
import { callMarkUploadedTesterCampaign, uploadRecording } from "../../config/api"; // 🔹 Import API upload
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { campaignId } = useParams();

  const user = useAppSelector((state) => state.account.user);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        chunks.current = [];

        // 🟢 Upload video lên server qua API uploadRecording
        try {
          setUploading(true);
          const file = new File([blob], "test-session.webm", {
            type: "video/webm",
          });
          // const res = await uploadRecording(
          //   file,
          //   campaignId || "",
          //   user?.id || 0
          // );
          // console.log("Kết quả upload:", res, campaignId, user?.id);
          // const fileNameUrl = res.data?.fileName || null;
        
        } catch (err) {
          console.error("❌ Lỗi upload file:", err);
        } finally {
          setUploading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Không thể khởi động ghi hình:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          backgroundColor: isRecording ? "#e53935" : "#4caf50",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {isRecording ? "🛑 Dừng ghi hình" : "🎥 Bắt đầu ghi hình"}
      </button>

      {uploading && <p>⏳ Đang tải video lên...</p>}
      {uploadedFileName && <p>✅ Upload thành công: {uploadedFileName}</p>}

      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <h4>Xem lại phiên kiểm thử:</h4>
          <video src={videoUrl} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;

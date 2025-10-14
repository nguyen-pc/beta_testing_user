import React, { useState, useRef } from "react";

const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // có thể tắt nếu không cần ghi âm
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        chunks.current = [];

        // ✅ Gửi file lên server Spring Boot
        const formData = new FormData();
        formData.append("file", blob, "test-session.webm");
        fetch("http://localhost:8080/api/v1/uploads/video", {
          method: "POST",
          body: formData,
        });
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
    <div>
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

      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <h4>Xem lại phiên kiểm thử:</h4>
          <video src={videoUrl} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const TestFlowContext = createContext<Ctx | null>(null);
export const useTestFlow = () => {
  const ctx = useContext(TestFlowContext);
  if (!ctx) throw new Error("useTestFlow must be used inside TestFlowProvider");
  return ctx;
};

export default function TestFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displayStream, setDisplayStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (!displayStream) throw new Error("No screen stream");
    // Merge display + mic tracks
    const tracks: MediaStreamTrack[] = [...displayStream.getTracks()];
    if (micStream) tracks.push(...micStream.getAudioTracks());
    const mixed = new MediaStream(tracks);

    const rec = new MediaRecorder(mixed, {
      mimeType: "video/webm;codecs=vp9,opus",
    });
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setLastBlob(blob);
    };
    rec.start();
    recRef.current = rec;
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const rec = recRef.current;
    if (!rec) return null;
    await new Promise<void>((resolve) => {
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setLastBlob(blob);
        setIsRecording(false);
        resolve();
      };
      rec.stop();
    });
    return lastBlob;
  };

  const value = useMemo<Ctx>(
    () => ({
      displayStream,
      micStream,
      setDisplayStream,
      setMicStream,
      recorder: recRef.current,
      isRecording,
      startRecording,
      stopRecording,
      lastBlob,
    }),
    [displayStream, micStream, isRecording, lastBlob]
  );

  return (
    <TestFlowContext.Provider value={value}>
      {children}
    </TestFlowContext.Provider>
  );
}

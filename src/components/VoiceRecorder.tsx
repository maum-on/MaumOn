// src/components/VoiceRecorder.tsx
import { useEffect, useRef, useState } from "react";

type VoiceRecorderProps = {
  onClose: () => void;
  onSave: (file: File) => void; // 녹음 완료 시 부모에게 File 전달
};

export default function VoiceRecorder({ onClose, onSave }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [time, setTime] = useState(0);
  const [bars, setBars] = useState([4, 8, 12, 8, 4]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const waveRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 🔊 파형 애니메이션
  useEffect(() => {
    if (recording) {
      waveRef.current = window.setInterval(() => {
        setBars((prev) => prev.map(() => Math.floor(Math.random() * 15) + 4));
      }, 180);
    } else {
      if (waveRef.current) clearInterval(waveRef.current);
      setBars([4, 8, 12, 8, 4]);
    }
  }, [recording]);

  // 🎤 스트림 정리 함수
  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupStream();
  }, []);

  // 🎤 녹음 시작
  const startRecording = async () => {
    cleanupStream();

    setAudioUrl(null);
    setAudioFile(null);
    setTime(0);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    // webm으로 녹음
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      const file = new File([blob], `record-${Date.now()}.webm`, {
        type: "audio/webm",
      });

      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    };

    mediaRecorder.start();
    setRecording(true);

    intervalRef.current = window.setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  // 🎤 녹음 정지
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = () => {
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-80 rounded-3xl shadow-xl p-6 relative">

        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={() => {
            cleanupStream();
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800 text-center">
          음성 일기 녹음
        </h2>

        {/* 파형 */}
        {recording && (
          <>
            <div className="flex justify-center items-end gap-2 h-16 mt-4 mb-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="w-2 bg-green-400 rounded-full transition-all duration-200"
                  style={{ height: `${h * 4}px` }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">{formatTime()}</p>
          </>
        )}

        {/* 녹음 버튼 */}
        {!audioUrl && (
          <div className="flex justify-center mt-6">
            {recording ? (
              <button
                onClick={stopRecording}
                className="px-5 py-2 bg-red-400 text-gray-700 rounded-xl"
              >
                녹음 종료
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-5 py-2 bg-green-500 text-gray-700 rounded-xl"
              >
                녹음 시작
              </button>
            )}
          </div>
        )}

        {/* 저장 / 재녹음 */}
        {audioUrl && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <audio controls src={audioUrl} className="w-full" />

            <button
              onClick={startRecording}
              className="px-4 py-2 rounded-xl bg-yellow-300 text-sm"
            >
              다시 녹음하기
            </button>

            <button
              onClick={() => audioFile && onSave(audioFile)}
              className="px-4 py-2 rounded-xl bg-green-500 text-gray-700 text-sm"
            >
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

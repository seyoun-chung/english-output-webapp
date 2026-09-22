import { useEffect, useRef, useState } from "react";
import {
  browserRecordingEnvironment,
  createAudioRecorder,
  emptyRecording,
} from "./audioRecorder";
import type { RecordingState } from "./audioRecorder";

export function RecordingNotice({
  recording,
  supported,
}: {
  recording: RecordingState;
  supported: boolean;
}) {
  const messages: Record<RecordingState["status"], string | null> = {
    idle: null,
    requesting: "마이크 사용을 허용해주세요.",
    recording: "Recording…",
    stopping: null,
    ready: "Listen and compare.",
    error: null,
  };
  const message = supported ? messages[recording.status] : null;
  const showPrivacy = supported && ["idle", "error"].includes(recording.status);
  return (
    <>
      {message && (
        <p className="voice-status" role="status">
          {message}
        </p>
      )}
      {!supported && (
        <p className="voice-error">
          녹음을 지원하지 않는 환경이에요. 일반 브라우저에서 localhost 또는
          HTTPS로 접속해주세요.
        </p>
      )}
      {recording.error && (
        <p className="voice-error" role="alert">
          {recording.error}
        </p>
      )}
      {showPrivacy && (
        <p className="voice-privacy">
          이동하거나 새로고침하면 앱 안의 녹음은 삭제돼요.
        </p>
      )}
    </>
  );
}

export function VoicePractice() {
  const [recording, setRecording] = useState(emptyRecording);
  const [supported] = useState(() => browserRecordingEnvironment.isSupported());
  const controller = useRef<ReturnType<typeof createAudioRecorder> | null>(
    null,
  );
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const current = createAudioRecorder(
      browserRecordingEnvironment,
      setRecording,
    );
    controller.current = current;
    const clear = () => {
      player.current?.pause();
      current.clear();
    };
    const onVisibility = () => {
      if (document.hidden) clear();
    };
    // Avoid background microphone capture and retained audio in the back/forward cache.
    window.addEventListener("pagehide", clear);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", clear);
      document.removeEventListener("visibilitychange", onVisibility);
      current.dispose();
      controller.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = player.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, [recording.url]);

  const { status } = recording;
  const busy = status === "requesting" || status === "stopping";
  return (
    <section className="voice-practice" aria-label="내 목소리로 점검하기">
      <div className="voice-heading">
        <span className="badge">Optional</span>
      </div>
      <div className="voice-actions">
        <button
          className={`speak-button ${status === "recording" ? "is-recording" : ""}`}
          disabled={!supported || busy}
          onClick={() =>
            status === "recording"
              ? controller.current?.stop()
              : void controller.current?.start()
          }
        >
          <span className="record-dot" aria-hidden="true" />
          {status === "recording"
            ? "Stop recording"
            : status === "requesting"
              ? "Waiting for permission…"
              : status === "stopping"
                ? "Preparing audio…"
                : recording.url
                  ? "Record again"
                  : "Record"}
        </button>
        {status === "requesting" && (
          <button
            className="text-button"
            onClick={() => controller.current?.clear()}
          >
            Cancel
          </button>
        )}
      </div>
      {recording.url && (
        <button
          className="secondary recording-delete"
          onClick={() => controller.current?.clear()}
        >
          <span className="recording-delete-label">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5" />
            </svg>
            Delete
          </span>
        </button>
      )}
      <RecordingNotice recording={recording} supported={supported} />
      {recording.url && (
        <div className="voice-playback">
          <span>Your recording</span>
          <audio
            key={recording.url}
            ref={player}
            src={recording.url}
            controls
            preload="metadata"
            aria-label="Your recording"
            onError={() => controller.current?.playbackError()}
          />
        </div>
      )}
    </section>
  );
}

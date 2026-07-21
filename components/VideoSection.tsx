"use client";

import React, { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type VideoSectionProps = {
  src?: string;
  poster?: string;
};

const VideoSection = ({
  src = "/videos/0711.mp4",
  poster,
}: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;

    const nextMutedState = !videoRef.current.muted;

    videoRef.current.muted = nextMutedState;
    setIsMuted(nextMutedState);
  };

  const sectionStyle: React.CSSProperties = {
    height: "clamp(500px, 56.25vw, 100vh)",
    minHeight: 500,
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-black mt-9 "
      style={sectionStyle}
      data-video-section
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        aria-label="Background video"
      />

      <button
        type="button"
        onClick={toggleMute}
        className="absolute left-5 top-5 z-10 inline-flex h-11 items-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-white/80"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
        <span>{isMuted ? "Unmute" : "Mute"}</span>
      </button>
    </section>
  );
};

export default VideoSection;


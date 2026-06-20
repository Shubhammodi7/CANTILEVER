import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 inset-0 z-50 flex flex-col items-center justify-center bg-white select-none overflow-hidden">
      {/* Central High-Contrast Container Card */}
      <div className="relative flex flex-col items-center gap-6 p-10 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 max-w-xs w-full text-center">
        {/* Intricate Layered Geometric Logo Vector Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer High-Velocity Tracking Loop (Stark Black Primary) */}
          <div className="absolute inset-0 rounded-full border-[3px] border-t-black border-r-transparent border-b-black/10 border-l-transparent animate-spin [animation-duration:1.2s]" />

          {/* Inner Counter-Rotating Precision Core Ring (Subtle Slate Muted) */}
          <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-slate-400 border-b-transparent border-l-slate-200 animate-spin [animation-duration:0.8s] [animation-direction:reverse]" />

          {/* Core Center Focal Node (Your Signature Accent Red Identity Core) */}
          <div className="relative w-5 h-5 rounded bg-red-600 shadow-md shadow-red-600/20 rotate-45 transform transition-transform animate-pulse" />
        </div>

        {/* Typography Cluster Layer */}
        <div className="space-y-1 z-10">
          {/* Platform Identity Title Header (Stark Black Title) */}
          <h2 className="text-xl font-black tracking-tighter text-black">
            CANTILEVER{" "}
            <span className="text-red-600 font-medium tracking-normal">
              BLOG
            </span>
          </h2>

          {/* Dynamic subtext tracking message */}
          <div className="flex items-center justify-center gap-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] pl-[0.25em]">
              Securing Session
            </p>

            {/* Synchronized Jumping Dot Array (Accent Red Notation) */}
            <span className="flex gap-0.5 items-center justify-center h-2 mt-0.5">
              <span className="w-1 h-1 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-red-600 rounded-full animate-bounce" />
            </span>
          </div>
        </div>

        {/* Micro-Progress Loading Bar (Stark Black track with Red Progress Slider) */}
        <div className="w-full h-[2px] bg-slate-100 rounded-full overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-red-600 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

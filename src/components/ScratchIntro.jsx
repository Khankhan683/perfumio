import { useEffect, useRef, useState } from "react";

export default function ScratchIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const completed = useRef(false);

  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Golden Scratch Cover
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);

      gradient.addColorStop(0, "#8B641E");
      gradient.addColorStop(0.5, "#F5D98B");
      gradient.addColorStop(1, "#9C6B19");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Main Text
      ctx.fillStyle = "#111111";
      ctx.font = "bold 38px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("PERFUMIO", rect.width / 2, rect.height / 2 - 12);

      // Subtitle
      ctx.fillStyle = "#292014";
      ctx.font = "bold 13px Arial, sans-serif";
      ctx.fillText("SCRATCH TO DISCOVER", rect.width / 2, rect.height / 2 + 25);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Scratch Function
  const scratch = (e) => {
    if (revealed) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fill();
  };

  // Check Scratch Percentage
  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 50) {
        transparent++;
      }
    }

    const percent = (transparent / total) * 100;
    const rounded = Math.min(Math.round(percent), 100);

    setProgress(rounded);

    if (percent >= 50 && !completed.current) {
      completed.current = true;
      setRevealed(true);

      setTimeout(() => {
        onComplete?.();
      }, 2500);
    }
  };

  // Pointer Events
  const handlePointerDown = (e) => {
    if (revealed) return;

    isDrawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);

    scratch(e);
  };

  const handlePointerMove = (e) => {
    if (isDrawing.current) {
      scratch(e);
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;

    isDrawing.current = false;
    checkProgress();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black">
      {/* Background: Perfumio Banner Image */}
      <div className="absolute inset-0">
        <img
          src="/perfumio-scratch-bg.png"
          alt="Perfumio Luxury Perfumes"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Fireworks */}
      {revealed && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {Array.from({ length: 45 }).map((_, i) => (
            <span
              key={i}
              className="firework-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 85}%`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            >
              ✨
            </span>
          ))}
        </div>
      )}

      {/* Scratch Canvas */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
        />
      )}

      {/* Instructions */}
      {!revealed && (
        <div className="pointer-events-none absolute bottom-16 left-0 z-10 w-full text-center">
          <p className="text-base font-extrabold tracking-[4px] text-black">
            SCRATCH TO REVEAL
          </p>

          <p className="mt-3 text-sm font-semibold text-neutral-900">
            Use your finger or mouse
          </p>

          <p className="mx-auto mt-4 w-fit rounded-full border border-black/20 bg-black/80 px-6 py-2 font-bold text-amber-300 shadow-lg">
            {progress}% Revealed
          </p>
        </div>
      )}

      {/* Welcome Message */}
      {revealed && (
        <div className="absolute bottom-16 z-30 w-full px-4 text-center">
          <h2 className="text-3xl font-bold text-amber-300 sm:text-5xl">
            Welcome to Perfumio
          </h2>

          <p className="mt-3 text-white">
            Discover the world of luxury fragrances.
          </p>
        </div>
      )}

      {/* Fireworks Animation */}
      <style>{`
        .firework-particle {
          position: absolute;
          font-size: 25px;
          animation: firework 1.5s ease-out forwards;
        }

        @keyframes firework {
          0% {
            opacity: 1;
            transform: scale(0.2) translateY(0);
          }

          100% {
            opacity: 0;
            transform: scale(2.5) translateY(-100px);
          }
        }
      `}</style>
    </div>
  );
}

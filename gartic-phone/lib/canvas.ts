import { useEffect } from "react";

export default function useCanvas(
  ref: React.RefObject<HTMLCanvasElement | null>,
  callback: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void
) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const loop = () => {
      callback(ctx, canvas);
      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [ref, callback]);
}

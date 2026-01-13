"use client";

import { useRef, useState, useEffect } from "react";
import useCanvas from "@/lib/canvas";
import {
  isMouseDown,
  localMouseX,
  localMouseY,
  addShortcut,
} from "@/lib/inputs";
import { HexColorPicker } from "react-colorful";
import PaintToolBar from "@/components/PaintToolBar";
import { renderCanvas, uploadCanvas } from "@/lib/paintUtils";

export default function Paint() {
  const [color, setColor] = useState("#000000");
  const [penSize, setPenSize] = useState(16);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lastX = useRef(0);
  const lastY = useRef(0);

  const history = useRef<ImageData[]>([]);
  const MAX_HISTORY = 50;

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

    history.current.push(image);
    if (history.current.length > MAX_HISTORY) {
      history.current.shift();
    }
  };

  useEffect(() => {
    addShortcut(["Control", "z"], () => {
      const canvas = canvasRef.current;
      if (!canvas || history.current.length === 0) return;

      const ctx = canvas.getContext("2d")!;
      const last = history.current.pop()!;
      ctx.putImageData(last, 0, 0);
    });
  }, []);

  useCanvas(canvasRef, (ctx, canvas) => {
    if (!isMouseDown(0)) return;

    const x = localMouseX(canvas);
    const y = localMouseY(canvas);

    ctx.strokeStyle = color;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX.current || x, lastY.current || y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="w-full mb-10">
        <p className="w-full text-center">HASŁO</p>
        <h1 className="w-full text-4xl font-bold text-center">SANTA</h1>
      </div>

      <div className="flex gap-4 mb-4">
        <PaintToolBar penSize={penSize} setPenSize={setPenSize} />
      </div>

      <div className="flex flex-row gap-10">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="
            easel
            block
            w-[800px]
            h-[500px]
            border
            border-neutral-400
          "
          onMouseDown={() => {
            lastX.current = 0;
            lastY.current = 0;
            saveHistory(); 
          }}
          onMouseUp={() => {
            lastX.current = 0;
            lastY.current = 0;
          }}
          onMouseLeave={() => {
            lastX.current = 0;
            lastY.current = 0;
          }}
        />

        <div className="items-between">
          <HexColorPicker color={color} onChange={setColor} />
          <button className="btn btn-secondary w-full"
            onClick={() => {
            if (canvasRef.current) {
                uploadCanvas(canvasRef.current);
              }
            }}
          >
            Wyślij
          </button>
        </div>
      </div>
    </div>
  );
}

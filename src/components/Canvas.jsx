import { useRef, useEffect, useState } from "react";

const Canvas = ({
  color,
  scale,
  setScale,
  lastImage,
  setLastImage,
  selectedShape,
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.lineWidth = 1 / scale;
    ctx.putImageData(savedImage, 0, 0);

    ctxRef.current = ctx;

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  const startDrawing = (e) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    if (setLastImage) {
      setLastImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    const x = e.nativeEvent.offsetX / scale;
    const y = e.nativeEvent.offsetY / scale;
    setStartPos({ x, y });

    if (selectedShape === "freehand") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const x = e.nativeEvent.offsetX / scale;
    const y = e.nativeEvent.offsetY / scale;

    ctx.putImageData(lastImage, 0, 0);

    ctx.fillStyle = color;

    if (selectedShape === "freehand") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (selectedShape === "rectangle") {
      const width = x - startPos.x;
      const height = y - startPos.y;
      ctx.fillRect(startPos.x, startPos.y, width, height);
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (selectedShape === "circle") {
      const width = x - startPos.x;
      const height = y - startPos.y;
      const size = Math.max(Math.abs(width), Math.abs(height));

      const topLeftX = width < 0 ? startPos.x - size : startPos.x;
      const topLeftY = height < 0 ? startPos.y - size : startPos.y;
      const radius = size / 2;

      ctx.beginPath();
      ctx.arc(topLeftX + radius, topLeftY + radius, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const minScale = 0.5;
    const maxScale = 5;

    setScale((prevScale) => {
      const newScale =
        prevScale * (e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity);
      return Math.min(Math.max(newScale, minScale), maxScale);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      className="canvas"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    />
  );
};

export default Canvas;

import { useRef, useEffect, useState } from "react";

const Canvas = ({ color, scale, setScale, setLastImage }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
      setLastImage(() => {
        const savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return () => ctx.putImageData(savedImage, 0, 0);
      });
    }

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX / scale, e.nativeEvent.offsetY / scale);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    ctx.lineTo(e.nativeEvent.offsetX / scale, e.nativeEvent.offsetY / scale);
    ctx.stroke();
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

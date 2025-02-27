import { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

function App() {
  const [color, setColor] = useState("#000000");
  const [scale, setScale] = useState(1);
  const [lastImage, setLastImage] = useState(null);
  const [selectedShape, setSelectedShape] = useState("freehand");

  const handleUndo = () => {
    if (lastImage) {
      const ctx = document.querySelector("canvas").getContext("2d");
      ctx.putImageData(lastImage, 0, 0); // Restore ImageData directly
      setLastImage(null);
    }
  };

  return (
    <div>
      <Toolbar
        setColor={setColor}
        handleUndo={handleUndo}
        setSelectedShape={setSelectedShape}
      />
      <Canvas
        color={color}
        scale={scale}
        setScale={setScale}
        lastImage={lastImage}
        setLastImage={setLastImage}
        selectedShape={selectedShape}
      />
    </div>
  );
}

export default App;

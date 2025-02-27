import { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

function App() {
  const [color, setColor] = useState("#000000");
  const [scale, setScale] = useState(1);
  const [lastImage, setLastImage] = useState(null);

  const handleUndo = () => {
    if (lastImage) {
      lastImage();
      setLastImage(null);
    }
  };

  return (
    <div>
      <Toolbar setColor={setColor} handleUndo={handleUndo} />
      <Canvas color={color} scale={scale} setScale={setScale} setLastImage={setLastImage} />
    </div>
  );
}

export default App;

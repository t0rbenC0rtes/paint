import { IoIosColorPalette } from "react-icons/io";

const Toolbar = ({ setColor, handleUndo, setSelectedShape }) => {
  return (
    <div className="toolbar">
      <label htmlFor="colorPicker">
        <IoIosColorPalette className="palette" />
      </label>
      <input
        type="color"
        id="colorPicker"
        onChange={(e) => setColor(e.target.value)}
      />
      <button onClick={handleUndo}>Undo</button>
      <button onClick={() => setSelectedShape("freehand")}>Freehand</button>
      <button onClick={() => setSelectedShape("rectangle")}>Rectangle</button>
      <button onClick={() => setSelectedShape("circle")}>Circle</button>
    </div>
  );
};

export default Toolbar;

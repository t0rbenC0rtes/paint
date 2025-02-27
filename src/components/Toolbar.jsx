import { IoIosColorPalette } from "react-icons/io";
import { FaUndo } from "react-icons/fa";

const Toolbar = ({ setColor, handleUndo }) => {
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
      <button onClick={handleUndo} className="undo">
        <FaUndo />
      </button>
    </div>
  );
};

export default Toolbar;

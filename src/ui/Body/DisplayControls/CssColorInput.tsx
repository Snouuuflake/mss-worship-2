import { useState, useRef } from "react";
import Icon from "../../Icon";
import "./FormInput.css";

const isColor = (strColor: string) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== "";
};

function CssColorInput({
  configEntry,
  updateConfig,
}: {
  configEntry: DisplayConfigEntryType;
  updateConfig: (configEntry: DisplayConfigEntryType, newValue: any) => void;
}) {
  const initValue =
    configEntry.value === null ? configEntry.default : configEntry.value;

  const [valid, setValid] = useState<boolean>(isColor(initValue));
  const inputRef = useRef<any>(null);

  return (
    <div className="text-input-v-container">
      <div className="text-input-title">{configEntry.key + " (CSS)"}</div>
      <div className="form-input-component text-input-h-container">
        <input
          ref={inputRef}
          className="text-input-input dark-material-input"
          contentEditable="true"
          style={{ borderColor: valid ? "green" : "darkred" }}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            setValid(isColor(value.trim()));
            updateConfig(configEntry, value);
            console.log(value);
          }}
          value={initValue}
        ></input>
        <button
          className="text-input-reset-button darken-hover"
          onClick={() => {
            setValid(isColor(inputRef.current.value));
            updateConfig(configEntry, null);
          }}
        >
          <Icon code="X" />
        </button>
      </div>
    </div>
  );
}

export default CssColorInput;

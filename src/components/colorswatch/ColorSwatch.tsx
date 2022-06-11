import { useState, CSSProperties } from "react";
import { ColorResult, SketchPicker } from "react-color";
import "./ColorSwatch.css";
import { zeroPad } from "@coderatparadise/showrunner-common";

export const ColorSwatch = (props: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="color-swatch">
      <div className="swatch" onClick={() => setOpen(!open)}>
        <div className="swatch-color-transparency" />
        <div
          className="swatch-color"
          style={{ "--color": props.color } as CSSProperties}
        />
      </div>
      {open ? (
        <div className="pop-over">
          <div className="cover" onClick={() => setOpen(false)} tabIndex={-1} />
          <SketchPicker
            color={props.color}
            onChange={(color: ColorResult) => {
              const alpha = Math.floor(color.rgb.a! * 255);
              props.onChange(`${color.hex}${zeroPad(alpha.toString(16), 2)}`);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

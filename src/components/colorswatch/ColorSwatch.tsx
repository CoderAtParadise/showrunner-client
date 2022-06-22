import { useState, CSSProperties } from "react";
import { ColorResult, SketchPicker } from "react-color";
import "./ColorSwatch.css";
import { zeroPad } from "@coderatparadise/showrunner-common";

export const ColorSwatch = (props: {
  className?: string;
  color: string;
  onChange: (color: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`color-swatch ${props.className}`}>
      <div
        className={`swatch ${props.className}`}
        onClick={() => setOpen(!open)}
      >
        <div className={`swatch-color-transparency ${props.className}`} />
        <div
          className={`swatch-color ${props.className}`}
          style={{ "--color": props.color } as CSSProperties}
        />
      </div>
      {open ? (
        <div className={`pop-over ${props.className}`}>
          <div
            className={`cover ${props.className}`}
            onClick={() => setOpen(false)}
            tabIndex={-1}
          />
          <SketchPicker
            className={props.className}
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

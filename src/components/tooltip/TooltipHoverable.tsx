import { MouseEventHandler, ReactNode } from "react";
import "./Tooltip.css";

export const TooltipHoverable = (props: {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`tooltip-hoverable ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

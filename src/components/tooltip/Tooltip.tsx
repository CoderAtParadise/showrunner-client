import { ReactNode, Children, isValidElement } from "react";
import { TooltipContent } from "./TooltipContent";
import { TooltipHoverable } from "./TooltipHoverable";
import "./Tooltip.css";

export const Tooltip = (props: {
  className?: string;
  children?: ReactNode;
}) => {
  let hasTooltipContent = false;
  let hasTooltipHoverable = false;
  Children.forEach(props.children, (child: ReactNode) => {
    if (isValidElement(child)) {
      if ((child as any).type.name === TooltipContent.name) {
        if (!hasTooltipContent) hasTooltipContent = true;
        else throw new Error("Duplicate TooltipContent");
      } else if ((child as any).type.name === TooltipHoverable.name) {
        if (!hasTooltipHoverable) hasTooltipHoverable = true;
        else throw new Error("Duplicate TooltipHoverable");
      }
    }
  });
  if (!hasTooltipContent) throw new Error("Missing TooltipContent");
  if (!hasTooltipHoverable) throw new Error("Missing TooltipHoverable");
  return <div className={`tooltip ${props.className}`}>{props.children}</div>;
};

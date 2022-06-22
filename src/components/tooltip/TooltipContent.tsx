
import { ReactNode } from "react";
import "./Tooltip.css";

export const TooltipContent = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    return <div className={`tooltip-content ${props.className}`}>{props.children}</div>;
};

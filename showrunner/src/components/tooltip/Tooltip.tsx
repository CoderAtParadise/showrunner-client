import { ReactNode, Children, isValidElement } from "react";
import styled from "@emotion/styled";
import { TooltipContent, TooltipHoverable } from ".";
const TooltipContainer = styled.div`
    position: relative;
`;

export const Tooltip = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    let hasTooltipContent = false;
    let hasTooltipHoverable = false;
    Children.forEach(props.children, (child: ReactNode) => {
        if (isValidElement(child)) {
            let hasEmotionBaseContent = false;
            let hasEmotionBaseTitle = false;
            if ("__emotion_base" in (child as any).type) {
                if (
                    (child as any).type.__emotion_base.name === TooltipContent.name
                )
                    hasEmotionBaseContent = true;
                else if (
                    (child as any).type.__emotion_base.name === TooltipHoverable.name
                )
                    hasEmotionBaseTitle = true;
            }
            if (
                (child as any).type.name === TooltipContent.name ||
                hasEmotionBaseContent
            ) {
                if (!hasTooltipContent) hasTooltipContent = true;
                else throw new Error("Duplicate TooltipContent");
            } else if (
                (child as any).type.name === TooltipHoverable.name ||
                hasEmotionBaseTitle
            ) {
                if (!hasTooltipHoverable) hasTooltipHoverable = true;
                else throw new Error("Duplicate TooltipHoverable");
            }
        }
    });
    if (!hasTooltipContent) throw new Error("Missing TooltipContent");
    if (!hasTooltipHoverable) throw new Error("Missing TooltipHoverable");
    return <TooltipContainer className={props.className}>{props.children}</TooltipContainer>;
};

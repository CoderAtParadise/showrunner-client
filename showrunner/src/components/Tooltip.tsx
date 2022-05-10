import { ReactNode, Children, isValidElement } from "react";
import styled from "@emotion/styled";

const Content = styled.span`
    visibility: hidden;
    font-size: 0.8em;
    font-style: normal;
    font-weight: normal;
    white-space: nowrap;
    width: fit-content;
    height: fit-content;
    background-color: rgb(100, 100, 100);
    border-radius: 6px;
    padding: 5px 5px;
    position: absolute;
    text-align: center;
    z-index: 1;
    opacity: 0;
    top: 125%;
    left: 50%;
    margin-left: -50%;
    transition: opacity 0.3s;
`;

const Text = styled.div`
    display: inline-block;
    &:hover + ${Content} {
        visibility: visible;
        opacity: 1;
    }
`;

const TooltipContainer = styled.div`
    position: relative;
`;

export const Tooltip = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    let hasTooltipContent = false;
    let hasTooltipTitle = false;
    Children.forEach(props.children, (child: ReactNode) => {
        if (isValidElement(child)) {
            let hasEmotionBaseContent = false;
            let hasEmotionBaseTitle = false;
            if ("__emotion_base" in (child as any).type) {
                if (
                    (child as any).type.__emotion_base.name === "TooltipContent"
                )
                    hasEmotionBaseContent = true;
                else if (
                    (child as any).type.__emotion_base.name === "TooltipTitle"
                )
                    hasEmotionBaseTitle = true;
            }
            if (
                (child as any).type.name === "TooltipContent" ||
                hasEmotionBaseContent
            ) {
                if (!hasTooltipContent) hasTooltipContent = true;
                else throw new Error("Duplicate TooltipContent");
            } else if (
                (child as any).type.name === "TooltipTitle" ||
                hasEmotionBaseTitle
            ) {
                if (!hasTooltipTitle) hasTooltipTitle = true;
                else throw new Error("Duplicate TooltipTitle");
            }
        }
    });
    if (!hasTooltipContent) throw new Error("Missing TooltipContent");
    if (!hasTooltipTitle) throw new Error("Missing TooltipTitle");
    return <TooltipContainer className={props.className}>{props.children}</TooltipContainer>;
};

export const TooltipTitle = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    return <Text className={props.className}>{props.children}</Text>;
};

export const TooltipContent = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    return <Content className={props.className}>{props.children}</Content>;
};

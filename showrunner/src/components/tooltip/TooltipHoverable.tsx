import styled from "@emotion/styled";
import { ReactNode } from "react";
import { StyledTooltipContent } from "./TooltipContent";

const Text = styled.div`
    display: inline-block;
    &:hover + ${StyledTooltipContent} {
        visibility: visible;
        opacity: 1;
    }
`;

export const TooltipHoverable = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    return <Text className={props.className}>{props.children}</Text>;
};

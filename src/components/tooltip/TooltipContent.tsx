import styled from "@emotion/styled";
import { ReactNode } from "react";

export const StyledTooltipContent = styled.span`
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

export const TooltipContent = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    return <StyledTooltipContent className={props.className}>{props.children}</StyledTooltipContent>;
};

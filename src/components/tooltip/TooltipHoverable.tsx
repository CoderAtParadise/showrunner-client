import styled from "@emotion/styled";
import { MouseEventHandler, ReactNode } from "react";

const Text = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
  &:hover + .tooltipcontent {
    visibility: visible;
    opacity: 1;
  }
`;

export const TooltipHoverable = (props: {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
}) => {
  return (
    <Text className={props.className} onClick={props.onClick}>
      {props.children}
    </Text>
  );
};

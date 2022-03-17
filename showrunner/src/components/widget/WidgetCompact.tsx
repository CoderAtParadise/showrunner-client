import { ReactNode } from "react";
import { Scrollable } from "../Scrollable";
import { WidgetHeader } from "./WidgetHeader";
import styled from "@emotion/styled";
import { ConfigBuilder } from "../config/ConfigBuilder";

const CompactContainer = styled.div`
    height: fit-content;
    width: 15em;
    max-height: 16.5em;
    min-height: 5em;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    border-style: solid;
    border-radius: 1em;
    border-width: 0.2em;
    padding: 0.4em;
`;

const Content = styled(Scrollable)`
    overflow: auto;
    height: fit-content;
    max-height: 14em;
    min-height: 5em;
`;

export const WidgetCompact = (props: {
    className?: string;
    config: ConfigBuilder,
    content: ReactNode;
}) => {
    return (
        <CompactContainer>
            <WidgetHeader
                config={props.config}
            />
            <Content>{props.content || "Loading..."}</Content>
        </CompactContainer>
    );
};

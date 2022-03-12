import { ReactNode } from "react";
import { Scrollable } from "../Scrollable";
import { IWidgetLayout } from "./IWidgetLayout";
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
    widgetLayout: IWidgetLayout<any>;
    config: ConfigBuilder,
    content: ReactNode;
    edit?: boolean;
}) => {
    // config.addConfig();

    // Sync config object to client
    return (
        <CompactContainer>
            <WidgetHeader
                layout={props.widgetLayout}
                config={props.config}
                edit={props.edit}
            />
            <Content>{props.content || "Loading..."}</Content>
        </CompactContainer>
    );
};

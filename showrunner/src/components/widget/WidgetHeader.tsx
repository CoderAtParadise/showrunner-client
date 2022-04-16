import { WidgetConfig } from "./WidgetConfig";
import styled from "@emotion/styled";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { ErrorBoundary } from "../ErrorBoundary";

const Header = styled.div`
    position: relative;
    width: 100%;
    height: 1.5em;
    align-items: left;
    justify-content: left;
    text-align: left;
    line-height: 1.5em;
    position: relative;
`;

const HR = styled.hr`
    width: 100%;
`;
const Title = styled.div`
    margin-top: 0.5em;
    font-weight: bold;
    width: 50%;
`;

export const WidgetHeader = (props: {
    className?: string;
    config: ConfigBuilder;
}) => {
    if (!props.config.get("widget.header")?.get() && !props.config.edit)
        return null;
    return (
        <>
            <Header className={props.className}>
                <WidgetConfig config={props.config} />
                <Title>
                    {(props.config
                        .get("widget.displayName")
                        ?.get() as string) || ""}
                </Title>
            </Header>
            <HR />
        </>
    );
};

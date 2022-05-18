import { WidgetConfig } from "./WidgetConfig";
import styled from "@emotion/styled";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { Tooltip, TooltipContent, TooltipHoverable } from "../tooltip";

const Header = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 1.5em;
    align-items: left;
    justify-content: left;
    text-align: left;
    line-height: 1.5em;
`;

const HR = styled.hr`
    width: 100%;
`;
const Title = styled(Tooltip)`
    width: 75%;
`;
const TitleText = styled(TooltipHoverable)`
    margin-top: 0.5em;
    font-weight: bold;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
        cursor: default;
    }
`;

export const WidgetHeader = (props: {
    className?: string;
    config: ConfigBuilder;
}) => {
    if (!props.config.get("widget.header")?.get() && !props.config.edit)
        return null;
    const displayName =
        (props.config.get("widget.displayName")?.get() as string) || "";
    return (
        <>
            <Header className={props.className}>
                <Title>
                    <TitleText>{displayName}</TitleText>
                    <TooltipContent>{displayName}</TooltipContent>
                </Title>
                <WidgetConfig config={props.config} />
            </Header>
            <HR />
        </>
    );
};

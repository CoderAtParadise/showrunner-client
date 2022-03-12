import { IWidgetLayout } from "./IWidgetLayout";
import { WidgetConfigure } from "./WidgetPopupConfig";
import styled from "@emotion/styled";
import { ConfigBuilder } from "../config/ConfigBuilder";

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
    layout: IWidgetLayout<any>;
    config: ConfigBuilder;
    edit?: boolean;
}) => {
    if (!props.layout.config.widget?.header && !props.edit) return null;
    return (
        <>
            <Header className={props.className}>
                <WidgetConfigure
                    layout={props.layout}
                    edit={props.edit}
                />
                <Title>{props.layout.config.widget.displayName}</Title>
            </Header>
            <HR />
        </>
    );
};

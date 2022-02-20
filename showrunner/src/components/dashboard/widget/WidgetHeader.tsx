import { IWidgetLayout } from "./IWidgetLayout";
import { WidgetConfigure } from "./WidgetConfigure";
import styled from "@emotion/styled";
import { IWidgetConfigMenu } from "./IWidget";

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
    configMenus: IWidgetConfigMenu<any>[];
    layout: IWidgetLayout<any, any>;
    edit?: boolean;
}) => {
    if (!props.layout.style.widget?.header && !props.edit) return null;
    return (
        <>
            <Header className={props.className}>
                <WidgetConfigure
                    configMenus={props.configMenus}
                    layout={props.layout}
                    edit={props.edit}
                />
                <Title>{props.layout.config.widget.displayName}</Title>
            </Header>
            <HR />
        </>
    );
};

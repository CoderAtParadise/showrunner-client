import { Box } from "@mui/material";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { IWidgetLayout } from "./IWidgetLayout";
import { WidgetConfigure } from "./WidgetConfigure";

export const WidgetHeader = (props: {
    className?: string;
    configMenu: ReactNode;
    widgetLayout: IWidgetLayout;
}) => {
    return (
        <>
            <Box className={props.className}>
                <WidgetConfigure
                    configMenu={props.configMenu}
                    widgetLayout={props.widgetLayout}
                />
            </Box>
        </>
    );
};

export const Widget = (props: {
    className?: string;
    widget: IWidgetLayout;
}) => {
    const [configMenu, setConfig] = useState<ReactNode>(null);
    const [content, setContent] = useState<ReactNode | ReactNode[]>(null);
    const fetchWidget = useCallback(async () => {
        const Widget = await import(`./${props.widget.widget}`);
        console.log(props.widget.config);
        setConfig(Widget.default.config({ config: props.widget.config }));
        setContent(Widget.default.renderMode.compact({ wiget: props.widget }));
    }, []);
    useEffect(() => {
        fetchWidget();
    }, [fetchWidget]);
    return (
        <Box className={props.className}>
            <WidgetHeader configMenu={configMenu} widgetLayout={props.widget} />
            {content || "Loading..."}
        </Box>
    );
};

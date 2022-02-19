import { ReactNode, useCallback, useEffect, useState } from "react";
import { IWidgetLayout, RenderMode } from "./IWidgetLayout";
import { LooseObject } from "../../../util/LooseObject";
import { WidgetCompact } from "./WidgetCompact";
import { IWidgetConfigMenu } from "./IWidget";

export const Widget = (props: {
    className?: string;
    layout: IWidgetLayout<any, any>;
    edit?: boolean;
}) => {
    const [configMenus, setConfigMenus] = useState<IWidgetConfigMenu<any>[]>(
        []
    );
    const [content, setContent] = useState<ReactNode | ReactNode[]>(null);
    const fetchWidget = useCallback(async () => {
        const Widget = await import(`./${props.layout.widget}`);
        const menus = Widget.default.config;
        //menus.push()
        setConfigMenus(menus);
        const looseRenderList = Widget.default.renderMode as LooseObject;
        let renderMode = looseRenderList[props.layout.renderMode as string];
        if (renderMode === undefined) renderMode = looseRenderList.default;
        setContent(renderMode.render({ layout: props.layout }));
    }, []);
    useEffect(() => {
        fetchWidget();
    }, [fetchWidget]);
    switch (props.layout.config.renderMode) {
        case RenderMode.COMPACT:
            return (
                <WidgetCompact
                    widgetLayout={props.layout}
                    configMenus={configMenus}
                    content={content}
                    edit={props.edit}
                />
            );
        default:
            return (
                <WidgetCompact
                    widgetLayout={props.layout}
                    configMenus={configMenus}
                    content={content}
                    edit={props.edit}
                />
            );
    }
};

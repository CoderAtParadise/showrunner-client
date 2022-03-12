import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { IWidgetLayout, RenderMode } from "./IWidgetLayout";
import { LooseObject } from "../../util/LooseObject";
import { WidgetCompact } from "./WidgetCompact";
import { ConfigBuilder } from "../config/ConfigBuilder";

export const Widget = (props: {
    className?: string;
    layout: IWidgetLayout<any>;
    edit?: boolean;
}) => {
    const config = useMemo(
        () => new ConfigBuilder(props.layout.config),
        [props.layout.config]
    );
    const [content, setContent] = useState<ReactNode | ReactNode[]>(null);
    const fetchWidget = useCallback(async () => {
        const Widget = await import(`../../widgets/${props.layout.widget}`);
        config.buildConfig(Array.from(Widget.default.config));
        const looseRenderList = Widget.default.renderMode as LooseObject;
        let renderMode = looseRenderList[props.layout.renderMode as string];
        if (renderMode === undefined) renderMode = looseRenderList.default;
        setContent(renderMode.render({ layout: props.layout }));
    }, [config, props.layout]);
    useEffect(() => {
        fetchWidget();
    }, [fetchWidget]);
    console.log(config);
    switch (props.layout.config.renderMode) {
        case RenderMode.COMPACT:
            return (
                <WidgetCompact
                    widgetLayout={props.layout}
                    config={config}
                    content={content}
                    edit={props.edit}
                />
            );
        default:
            return (
                <WidgetCompact
                    widgetLayout={props.layout}
                    config={config}
                    content={content}
                    edit={props.edit}
                />
            );
    }
};

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { IWidgetLayout, RenderMode, WidgetConfigurable } from "./IWidgetLayout";
import { LooseObject } from "../../util/LooseObject";
import { WidgetCompact } from "./WidgetCompact";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { StateStorageWatcher } from "../config/StateConfigStorageWatcher";
import { IConfigurable } from "../config/IConfigurable";

export const Widget = (props: {
    className?: string;
    layout: IWidgetLayout<any>;
    edit?: boolean;
}) => {
    const [config, setConfig] = useState(props.layout.config);
    const builder = useMemo(() => {
        return new ConfigBuilder(
            "system",
            new StateStorageWatcher(config, setConfig),
            props.edit
        );
    }, [props.edit]);
    useEffect(() => {
        builder.setStorage(config);
        if (config !== props.layout.config) {
            const delayChange = setTimeout(() => {
                console.log("Synced");
            }, 500);
            return () => clearTimeout(delayChange);
        }
        return () => {};
    }, [builder, config, props.layout.config]);
    const [content, setContent] = useState<ReactNode | ReactNode[]>(null);
    const fetchWidget = useCallback(async () => {
        const Widget = await import(`../../widgets/${props.layout.widget}`);
        builder.buildConfig(
            Array.from(Widget.default.config).concat(
                Array.from(WidgetConfigurable) as IConfigurable[]
            ) as IConfigurable[]
        );
        const looseRenderList = Widget.default.renderMode as LooseObject;
        let renderMode = looseRenderList[props.layout.renderMode as string];
        if (renderMode === undefined) renderMode = looseRenderList.default;
        setContent(renderMode.render({ config: builder }));
    }, [builder, props.layout]);
    useEffect(() => {
        fetchWidget();
    }, [fetchWidget]);
    switch (props.layout.config.renderMode) {
        case RenderMode.COMPACT:
            return <WidgetCompact config={builder} content={content} />;
        default:
            return <WidgetCompact config={builder} content={content} />;
    }
};

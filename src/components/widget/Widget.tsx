import { useCallback, useEffect, useMemo, useState } from "react";
import { IWidgetLayout, RenderMode, WidgetConfigurable } from "./IWidgetLayout";
import { LooseObject } from "../../util/LooseObject";
import { WidgetCompact } from "./WidgetCompact";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { StateStorageWatcher } from "../config/StateStorageWatcher";
import { IConfigurable } from "../config/IConfigurable";
import { isEqual } from "lodash";

export const Widget = (props: {
    className?: string;
    layout: IWidgetLayout<any>;
    edit?: boolean;
}) => {
    const [renderMode, setRenderMode] = useState<any | null>(null);
    const [config, setConfig] = useState(props.layout.config);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, markDirty] = useState({ dummy: false });
    const [initialLoad, setInitialLoad] = useState(true);

    const forceupdate = () => {
        markDirty((prevState) => ({ dummy: !prevState.dummy }));
    };

    const builder = useMemo(() => {
        return new ConfigBuilder(
            "system",
            "system",
            new StateStorageWatcher(config, setConfig, () => {}),
            props.edit
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.edit]);

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }
        if (!isEqual(config, props.layout.config)) {
            const delayChange = setTimeout(() => {
                console.log("Synced");
            }, 500);
            return () => clearTimeout(delayChange);
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, props.layout.config]);

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
        setRenderMode(renderMode);
    }, [builder, props.layout]);

    useEffect(() => {
        fetchWidget();
    }, [fetchWidget]);
    // prettier-ignore
    switch (props.layout.config.renderMode) {
        case RenderMode.COMPACT:
            return (
                <WidgetCompact
                    config={builder}
                    content={
                        renderMode
                            ? renderMode.render({
                                config: builder,
                                forceUpdate: forceupdate
                            })
                            : null
                    }
                />
            );
        default:
            return (
                <WidgetCompact
                    config={builder}
                    content={
                        renderMode
                            ? renderMode.render({
                                config: builder,
                                forceUpdate: forceupdate
                            })
                            : null
                    }
                />
            );
    }
};

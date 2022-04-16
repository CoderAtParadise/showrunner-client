import { ReactNode } from "react";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { IConfigurable } from "../config/IConfigurable";
export interface IWidgetRenderer {
    render: (props: {
        className?: string;
        config: ConfigBuilder;
        forceUpdate: () => void;
    }) => ReactNode;
}

export interface IWidget {
    renderMode: {
        default: IWidgetRenderer;
        compact?: IWidgetRenderer;
        compactExpanded?: IWidgetRenderer;
        expandedCompact?: IWidgetRenderer;
        expanded?: IWidgetRenderer;
        resizeable?: IWidgetRenderer;
    };
    config: IConfigurable[];
}

import { ReactElement, ReactNode } from "react";
import { IWidgetLayout } from "./IWidgetLayout";

export interface IWidgetConfigMenu<Config> {
    menu: string;
    icon: ReactElement;
    tooltip: string;
    render: (props: { config: Config }) => ReactNode;
}

export interface IWidgetRenderer<S, C> {
    render: (props: { layout: IWidgetLayout<S, C> }) => ReactNode;
}

export interface IWidget<S, C> {
    renderMode: {
        default: IWidgetRenderer<S, C>;
        compact?: IWidgetRenderer<S, C>;
        compactExpanded?: IWidgetRenderer<S, C>;
        expandedCompact?: IWidgetRenderer<S, C>;
        expanded?: IWidgetRenderer<S, C>;
        resizeable?: IWidgetRenderer<S, C>;
    };
    config: IWidgetConfigMenu<any>[];
}

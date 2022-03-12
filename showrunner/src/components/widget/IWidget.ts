import { ReactNode } from "react";
import { IConfigurable } from "../config/IConfigurable";
import { IWidgetLayout } from "./IWidgetLayout";
export interface IWidgetRenderer<C> {
    render: (props: {
        className?: string;
        layout: IWidgetLayout<C>;
    }) => ReactNode;
}

export interface IWidget<C> {
    renderMode: {
        default: IWidgetRenderer<C>;
        compact?: IWidgetRenderer<C>;
        compactExpanded?: IWidgetRenderer<C>;
        expandedCompact?: IWidgetRenderer<C>;
        expanded?: IWidgetRenderer<C>;
        resizeable?: IWidgetRenderer<C>;
    };
    config: IConfigurable[];
}

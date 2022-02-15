import { ReactNode } from "react";
import { IWidgetLayout } from "./IWidgetLayout";

export interface IWidgetConfig {
    config: object;
}

export interface IWidget {
    renderMode: {
        compact: (props:{layout:IWidgetLayout}) => ReactNode;
        expanded: (props:{layout:IWidgetLayout}) => ReactNode;
    };
    config: (props: IWidgetConfig) => ReactNode;
}

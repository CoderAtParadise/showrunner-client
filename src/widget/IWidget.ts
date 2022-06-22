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
    renderer: IWidgetRenderer;
    settings: IConfigurable[];
}
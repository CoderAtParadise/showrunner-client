import { ConfigurableType, IConfigurable } from "../config/IConfigurable";

export enum RenderMode {
    COMPACT = "compact",
    EXPANDED = "expanded"
}

export const WidgetConfigurable: IConfigurable[] = [
    {
        type: ConfigurableType.Text,
        category: "widget",
        displayName: "Widget Name",
        group: "widget",
        key: "displayName"
    },
    {
        type: ConfigurableType.Boolean,
        category: "widget",
        displayName: "Show Header",
        group: "widget",
        key: "header"
    }
];

export interface WidgetConfig {
    widget: {
        displayName?: string;
        header?: boolean;
        height?: string;
        width?: string;
    };
}

export interface IWidgetLayout<Config> {
    id: string;
    widget: string;
    renderMode: RenderMode;
    config: WidgetConfig & Config;
    position: {
        x: number;
        y: number;
        z: number;
    };
}

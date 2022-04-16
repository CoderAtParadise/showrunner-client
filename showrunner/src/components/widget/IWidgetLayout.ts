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
    },
    {
        type: ConfigurableType.Dropdown,
        category: "widget",
        displayName: "Dropdown Test",
        group: "widget",
        key: "dropdown",
        Options: () => {
            return [
                { id: "test1", label: "Test1" },
                { id: "test2", label: "Test2" }
            ];
        }
    }
];

export interface WidgetConfig {
    widget: {
        displayName?: string;
        header?: boolean;
        height?: string;
        width?: string;
        backgroundColor?: string;
        border?: boolean;
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

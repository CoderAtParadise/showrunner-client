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
        type: ConfigurableType.Button,
        category: "widget",
        displayName: "Test Button",
        group: "widget",
        key: "testbutton",
        onClick: () => {
            console.log("Button Click");
        }
    },
    {
        type: ConfigurableType.Time,
        category: "widget",
        displayName: "Test Time",
        group: "widget",
        key: "time"
    },
    {
        type: ConfigurableType.Number,
        category: "widget",
        displayName: "Test Number",
        group: "widget",
        key: "testNumber",
        Options: () => {
            return [
                { id: "min", label: "2" },
                { id: "max", label: "10" }
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

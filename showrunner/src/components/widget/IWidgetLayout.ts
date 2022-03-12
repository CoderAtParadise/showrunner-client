export enum RenderMode {
    COMPACT = "compact",
    EXPANDED = "expanded"
}

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

export enum RenderMode {
    COMPACT = "compact",
    EXPANDED = "expanded"
}

export interface WidgetStyle {
    widget: {
        header?: boolean;
        height?: string;
        width?: string;
    };
}

export interface WidgetConfig {
    widget: {
        displayName: string;
    };
}

export interface IWidgetLayout<
    Style,
    Config
> {
    id: string;
    widget: string;
    renderMode: RenderMode;
    style: WidgetStyle & Style
    position: {
        x: number;
        y: number;
        z: number;
    };
    config: WidgetConfig & Config;
}
